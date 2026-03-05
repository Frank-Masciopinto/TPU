import React from 'react';
import { createRoot } from 'react-dom/client';
import { ForumApp } from '../../components/forum/ForumApp';
import { getAuth } from '../../components/forum/forumApi';

/**
 * Exchange BigCommerce customer identity for a forum JWT token.
 * Called when a BC user is logged in but doesn't have a forum token.
 */
async function exchangeBCForForumToken(config, bcCustomer) {
    // Always use production Worker for auth exchange - it has the required secrets
    // (SUPABASE_JWT_SECRET, BIGCOMMERCE_ACCESS_TOKEN) that aren't available in local dev.
    // The production Worker allows localhost origins in its CORS config.
    const authApiBase = 'https://cartertraileraxles.com';

    try {
        console.log('[Forum] Exchanging BC customer identity for forum token...');
        const response = await fetch(`${authApiBase}/auth/bc-exchange`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                customer_id: bcCustomer.id,
                email: bcCustomer.email,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('[Forum] Token exchange failed:', errorData);
            return null;
        }

        const data = await response.json();
        if (data.token) {
            // Store the forum token in localStorage
            window.localStorage.setItem('tpu_forum_token', data.token);
            console.log('[Forum] Token exchange successful, stored forum token');
            return data.token;
        }

        return null;
    } catch (error) {
        console.error('[Forum] Token exchange error:', error);
        return null;
    }
}

/**
 * Ensure the user is authenticated with the forum if they're logged into BigCommerce.
 * Returns the auth object.
 */
async function ensureForumAuth(config) {
    // Check if we already have a valid token
    const auth = getAuth(config);
    if (auth.token) {
        console.log('[Forum] Already have auth token');
        return auth;
    }

    // Check if BigCommerce user is logged in
    const bcCustomer = (config && config.customer) || window.__TPU_FORUM__?.customer;
    if (!bcCustomer || !bcCustomer.id || !bcCustomer.email) {
        console.log('[Forum] No BC customer data, user is guest');
        return auth;
    }

    console.log('[Forum] BC customer detected, ID:', bcCustomer.id);

    // Exchange BC identity for forum token
    const token = await exchangeBCForForumToken(config, bcCustomer);
    if (token) {
        return { token, user: null };
    }

    return auth;
}

function ensureMountEl(config) {
    // Try multiple possible mount IDs
    const mountIds = [
        (config && config.mountId),
        'tpu-forum-root',
        'forum-app-root',
        'forum-root',
    ].filter(Boolean);

    for (const id of mountIds) {
        const el = document.getElementById(id);
        if (el) return el;
    }

    console.log('[Forum] No mount element found, using fallback');

    // Fallback: find the best content container and replace its content
    // Priority order for TPU theme
    const mainContent = document.querySelector('main.tpu-page-card')
        || document.querySelector('.tpu-page-content main')
        || document.querySelector('.tpu-page-content')
        || document.querySelector('.page-content')
        || document.querySelector('.page')
        || document.querySelector('[role="main"]')
        || document.querySelector('main')
        || document.querySelector('#main-content .body')
        || document.querySelector('.body');

    if (mainContent) {
        console.log('[Forum] Clearing content of:', mainContent.className || mainContent.tagName);
        // Clear the static page content to replace with forum
        mainContent.innerHTML = '';

        // Remove page-specific styling classes that conflict with forum
        mainContent.classList.remove('tpu-page-card', 'tpu-page-animate', 'tpu-page-animate--delay-4');

        // Add forum wrapper styling
        mainContent.classList.add('tpu-forum-wrapper');

        // Create mount point inside
        const el = document.createElement('div');
        el.id = 'tpu-forum-root';
        el.className = 'tpu-forum-container';
        mainContent.appendChild(el);

        return el;
    }

    // Last resort: append to body
    console.log('[Forum] Using body as fallback');
    const el = document.createElement('div');
    el.id = 'tpu-forum-root';
    el.className = 'tpu-forum-container';
    document.body.appendChild(el);
    return el;
}

function consumeAuthComplete() {
    try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('auth_complete')) {
            console.log('[Auth:Sync] auth_complete flag consumed');
            url.searchParams.delete('auth_complete');
            window.history.replaceState({}, '', url.pathname + url.search + url.hash);
            try { window.sessionStorage.removeItem('tpu_bc_sync_pending'); } catch (e) {}
            return true;
        }
    } catch (e) {}
    return false;
}

function decodeJwtPayload(token) {
    try {
        var parts = token.split('.');
        if (parts.length !== 3) return null;
        var payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        return JSON.parse(atob(payload));
    } catch (e) {
        return null;
    }
}

function scheduleProactiveRefresh(config, token) {
    var claims = decodeJwtPayload(token);
    if (!claims || !claims.exp) return;
    var msUntilRefresh = (claims.exp - 300) * 1000 - Date.now();
    if (msUntilRefresh > 0) {
        console.log('[Auth:Sync] scheduling proactive refresh in', Math.round(msUntilRefresh / 1000), 's');
        setTimeout(async function() {
            try {
                var { refreshToken } = await import('../../components/forum/forumApi');
                if (typeof refreshToken === 'function') {
                    var newToken = await refreshToken(config);
                    if (newToken) {
                        console.log('[Auth:Sync] proactive refresh complete, rescheduling');
                        scheduleProactiveRefresh(config, newToken);
                    }
                }
            } catch (e) {
                console.warn('[Auth:Sync] proactive refresh failed:', e.message);
            }
        }, msUntilRefresh);
    }

    // On visibility change: if token expires within 10 min, refresh immediately
    document.addEventListener('visibilitychange', async function onVis() {
        if (document.visibilityState !== 'visible') return;
        var auth = getAuth(config);
        if (!auth.token) return;
        var c = decodeJwtPayload(auth.token);
        if (!c || !c.exp) return;
        var msLeft = c.exp * 1000 - Date.now();
        if (msLeft < 10 * 60 * 1000) {
            console.log('[Auth:Sync] visibility refresh, token expires in', Math.round(msLeft / 1000), 's');
            try {
                var { refreshToken: doRefresh } = await import('../../components/forum/forumApi');
                if (typeof doRefresh === 'function') await doRefresh(config);
            } catch (e) {}
        }
    });
}

export default {
    async load() {
        console.log('[Forum] load() called');
        const config = window.__TPU_FORUM__;
        console.log('[Forum] config:', config);
        if (!config || !config.pageType) {
            console.log('[Forum] No config or pageType, returning');
            return;
        }

        consumeAuthComplete();

        await ensureForumAuth(config);

        const auth = getAuth(config);
        if (auth.token) {
            scheduleProactiveRefresh(config, auth.token);
        }

        const mountEl = ensureMountEl(config);
        console.log('[Forum] mountEl:', mountEl);
        const root = createRoot(mountEl);
        console.log('[Forum] Rendering ForumApp...');
        root.render(React.createElement(ForumApp, { config }));
        console.log('[Forum] ForumApp rendered');
    },
};
