function normalizeBase(base) {
    if (!base) return '/api/forum';
    return String(base).replace(/\/+$/, '');
}

function getAuthApiBase() {
    var isLocal = typeof window !== 'undefined' &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
    return isLocal ? 'http://localhost:8787' : 'https://cartertraileraxles.com';
}

export function getAuth(config) {
    // 1. Check config first (highest priority)
    const fromConfig = config && (config.authToken || config.token);
    if (fromConfig) return { token: String(fromConfig), user: null };

    // 2. Check Supabase session in localStorage
    // Supabase stores session with key pattern: sb-{project-ref}-auth-token
    try {
        const supabaseKey = Object.keys(window.localStorage).find(k => 
            k.startsWith('sb-') && k.endsWith('-auth-token')
        );
        if (supabaseKey) {
            const sessionData = window.localStorage.getItem(supabaseKey);
            if (sessionData) {
                const session = JSON.parse(sessionData);
                if (session && session.access_token) {
                    return { 
                        token: session.access_token, 
                        user: session.user || null,
                        expiresAt: session.expires_at || null
                    };
                }
            }
        }
    } catch (e) {
        // ignore parse errors
    }

    // 3. Check legacy forum token keys (fallback)
    try {
        const fromLs = window.localStorage.getItem('tpu_forum_token')
            || window.localStorage.getItem('tpuForumToken')
            || window.localStorage.getItem('forumToken');
        if (fromLs) return { token: String(fromLs), user: null };
    } catch (e) {
        // ignore
    }

    return { token: null, user: null };
}

function clearAllForumTokens() {
    try {
        window.localStorage.removeItem('tpu_forum_token');
        window.localStorage.removeItem('tpuForumToken');
        window.localStorage.removeItem('forumToken');
    } catch (e) { /* ignore */ }
}

let _refreshPromise = null;

export async function refreshToken(config) {
    if (_refreshPromise) return _refreshPromise;

    _refreshPromise = (async () => {
        const { token } = getAuth(config);
        if (!token) return null;

        const base = getAuthApiBase();
        try {
            console.log('[Auth:Sync] refresh-start');
            const res = await fetch(`${base}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                console.warn('[Auth:Sync] refresh-rejected:', res.status);
                clearAllForumTokens();
                return null;
            }

            const data = await res.json();
            if (data.token) {
                window.localStorage.setItem('tpu_forum_token', data.token);
                console.log('[Auth:Sync] refresh-ok');
                return data.token;
            }
            return null;
        } catch (e) {
            console.warn('[Auth:Sync] refresh-error:', e.message);
            return null;
        }
    })();

    try { return await _refreshPromise; } finally { _refreshPromise = null; }
}

function buildHeaders(config, needsAuth) {
    const headers = { 'Content-Type': 'application/json' };
    if (needsAuth) {
        const { token } = getAuth(config);
        if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
}

async function request(config, path, { method = 'GET', body, needsAuth = false, _retried = false } = {}) {
    const base = normalizeBase(config && (config.apiBase || config.apiBaseUrl || config.apiBaseURL));
    const url = `${base}${path}`;

    const res = await fetch(url, {
        method,
        headers: buildHeaders(config, needsAuth),
        body: body ? JSON.stringify(body) : undefined,
        credentials: 'include',
    });

    const isJson = (res.headers.get('content-type') || '').includes('application/json');
    const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

    // 401 interceptor: attempt one token refresh then retry
    if (res.status === 401 && needsAuth && !_retried) {
        const newToken = await refreshToken(config);
        if (newToken) {
            return request(config, path, { method, body, needsAuth, _retried: true });
        }
        clearAllForumTokens();
    }

    if (!res.ok) {
        const message = (data && data.message) || (typeof data === 'string' ? data : '') || `Request failed (${res.status})`;
        const err = new Error(message);
        err.status = res.status;
        err.data = data;
        throw err;
    }

    return data;
}

export function forumApi(config) {
    return {
        async listThreads(params) {
            const p = new URLSearchParams();
            if (params && params.q) p.set('q', params.q);
            if (params && params.sort) p.set('sort', params.sort);
            if (params && params.filter) p.set('filter', params.filter);
            if (params && params.page) p.set('page', String(params.page));
            if (params && params.pageSize) p.set('pageSize', String(params.pageSize));
            const qs = p.toString() ? `?${p.toString()}` : '';
            return request(config, `/threads${qs}`);
        },

        async getThread(threadId) {
            try {
                return await request(config, `/threads/${encodeURIComponent(threadId)}`);
            } catch (e) {
                return request(config, `/thread?t=${encodeURIComponent(threadId)}`);
            }
        },

        async getThreadBySlug(slug) {
            return request(config, `/threads/by-slug/${encodeURIComponent(slug)}`);
        },

        async listComments(threadId, sort) {
            const p = new URLSearchParams();
            if (sort) p.set('sort', sort);
            const qs = p.toString() ? `?${p.toString()}` : '';
            return request(config, `/threads/${encodeURIComponent(threadId)}/comments${qs}`);
        },

        async createThread(payload) {
            return request(config, '/threads', { method: 'POST', body: payload, needsAuth: true });
        },

        async createComment(threadId, payload) {
            return request(config, `/threads/${encodeURIComponent(threadId)}/comments`, { method: 'POST', body: payload, needsAuth: true });
        },

        async voteThread(threadId, delta) {
            return request(config, `/threads/${encodeURIComponent(threadId)}/vote`, { method: 'POST', body: { delta }, needsAuth: true });
        },

        async voteComment(commentId, delta) {
            return request(config, `/comments/${encodeURIComponent(commentId)}/vote`, { method: 'POST', body: { delta }, needsAuth: true });
        },

        // =====================================================================
        // Admin API Methods
        // =====================================================================

        /**
         * Get admin status for the current authenticated user
         * Returns { isAdmin, role, displayName, email }
         */
        async getAdminStatus() {
            return request(config, '/admin/me', { method: 'GET', needsAuth: true });
        },

        /**
         * Get list of all admin emails (for badge display)
         * Returns { admins: { [email]: displayName } }
         */
        async getAdminList() {
            return request(config, '/admin/list', { method: 'GET' });
        },

        /**
         * Delete a thread (admin only)
         */
        async deleteThread(threadId) {
            return request(config, `/threads/${encodeURIComponent(threadId)}`, { method: 'DELETE', needsAuth: true });
        },

        /**
         * Delete a comment (admin only)
         */
        async deleteComment(commentId) {
            return request(config, `/comments/${encodeURIComponent(commentId)}`, { method: 'DELETE', needsAuth: true });
        },
    };
}

