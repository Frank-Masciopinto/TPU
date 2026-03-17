import PageManager from './page-manager';
import { getAuth } from '../components/forum/forumApi';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const WORKER = isLocal ? 'http://localhost:8787' : 'https://cartertraileraxles.com';
const DEBOUNCE_MS = 300;

function esc(s) {
    return String(s || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function fmtMoney(v) {
    if (v == null) return '—';
    return '$' + Number(v).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function fmtDate(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
        });
    } catch (_) { return iso; }
}

function fmtDateTime(iso) {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: 'numeric', minute: '2-digit',
        });
    } catch (_) { return iso; }
}

export default class AdminQuotes extends PageManager {
    onReady() {
        this.$checking     = $('#aq-checking');
        this.$notLoggedIn  = $('#aq-not-logged-in');
        this.$accessDenied = $('#aq-access-denied');
        this.$app          = $('#aq-app');
        this.$searchInput  = $('#aq-search-input');
        this.$clearBtn     = $('#aq-clear-btn');
        this.$scopeTabs    = $('.aq-scope-tab');
        this.$results      = $('#aq-results');
        this.$tbody        = $('#aq-tbody');
        this.$countChip    = $('#aq-count-chip');
        this.$pagination   = $('#aq-pagination');
        this.$empty        = $('#aq-empty');
        this.$error        = $('#aq-error');
        this.$loading      = $('#aq-loading');

        this.currentField  = 'all';
        this.currentQuery  = '';
        this.currentLimit  = 20;
        this.debounceTimer = null;

        this.bindEvents();
        this.init();
    }

    bindEvents() {
        // Scope tabs
        this.$scopeTabs.on('click', (e) => {
            const $tab = $(e.currentTarget);
            this.$scopeTabs.removeClass('is-active');
            $tab.addClass('is-active');
            this.currentField = $tab.data('field');
            this.load(1);
        });

        // Search input — debounced live search
        this.$searchInput.on('input', () => {
            const q = this.$searchInput.val().trim();
            this.$clearBtn.toggle(q.length > 0);
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                this.currentQuery = q;
                this.load(1);
            }, DEBOUNCE_MS);
        });

        // Clear button
        this.$clearBtn.on('click', () => {
            this.$searchInput.val('').trigger('focus');
            this.$clearBtn.hide();
            this.currentQuery = '';
            this.load(1);
        });

        // Enter key still triggers immediate search
        this.$searchInput.on('keydown', (e) => {
            if (e.key === 'Enter') {
                clearTimeout(this.debounceTimer);
                this.currentQuery = this.$searchInput.val().trim();
                this.load(1);
            }
        });
    }

    async exchangeBCToken(bcCustomer) {
        try {
            const res = await fetch(`${WORKER}/auth/bc-exchange`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer_id: bcCustomer.id, email: bcCustomer.email }),
            });
            if (!res.ok) return null;
            const data = await res.json();
            if (data.token) {
                localStorage.setItem('tpu_forum_token', data.token);
                return data.token;
            }
        } catch (_) {}
        return null;
    }

    async init() {
        this.showState('checking');

        let { token } = getAuth(null);

        if (!token) {
            const config = window.__TPU_ADMIN_QUOTES__;
            const bcCustomer = config && config.customer;
            if (bcCustomer && bcCustomer.id && bcCustomer.email) {
                token = await this.exchangeBCToken(bcCustomer);
            }
        }

        if (!token) {
            this.showState('not-logged-in');
            return;
        }

        try {
            const res = await fetch(`${WORKER}/admin/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) { this.showState('not-logged-in'); return; }
            if (!res.ok) { this.showState('not-logged-in'); return; }

            const data = await res.json().catch(() => ({}));
            if (!data.isAdmin) { this.showState('access-denied'); return; }

            this.showState('app');
            // Auto-load all quotes immediately
            this.load(1);
        } catch (err) {
            console.error('[AdminQuotes] init error:', err);
            this.showState('not-logged-in');
        }
    }

    showState(state) {
        this.$checking.hide();
        this.$notLoggedIn.hide();
        this.$accessDenied.hide();
        this.$app.hide();

        if (state === 'checking')      this.$checking.show();
        if (state === 'not-logged-in') this.$notLoggedIn.show();
        if (state === 'access-denied') this.$accessDenied.show();
        if (state === 'app')           this.$app.show();
    }

    async load(page) {
        const { token } = getAuth(null);
        if (!token) { this.init(); return; }

        this.setLoading(true);
        this.clearStates();

        const params = new URLSearchParams({
            page: String(page),
            limit: String(this.currentLimit),
        });

        if (this.currentQuery) {
            params.set('q', this.currentQuery);
            if (this.currentField !== 'all') {
                params.set('field', this.currentField);
            }
        }

        try {
            const res = await fetch(`${WORKER}/admin/quotes?${params}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (res.status === 401) { this.init(); this.setLoading(false); return; }
            if (res.status === 403) { this.setLoading(false); this.showError('Access denied.'); return; }

            if (!res.ok) {
                const d = await res.json().catch(() => ({}));
                this.setLoading(false);
                this.showError(`Error ${res.status}: ${d.error || 'Unknown error'}`);
                return;
            }

            const data = await res.json();
            this.setLoading(false);
            this.renderResults(data, page);
        } catch (err) {
            this.setLoading(false);
            this.showError('Network error — could not reach the server.');
            console.error('[AdminQuotes]', err);
        }
    }

    renderResults({ data, total, limit }, page) {
        const lim = limit || this.currentLimit;

        if (!data || data.length === 0) {
            this.$empty.show();
            this.updateCount(0, 0, 0);
            return;
        }

        const now = new Date();
        this.$tbody.empty();

        for (const row of data) {
            const expired = new Date(row.expires_at) < now;
            const $tr = $('<tr>');
            if (expired) $tr.addClass('aq-row-expired');

            $tr.html(`
                <td><span class="aq-quote-num">${esc(row.quote_number)}</span></td>
                <td>${esc(row.customer_name || '—')}</td>
                <td class="aq-cell-muted">${esc(row.customer_email || '—')}</td>
                <td class="aq-cell-muted">${esc(row.customer_phone || '—')}</td>
                <td>${fmtMoney(row.grand_total)}</td>
                <td class="aq-cell-muted">${fmtDate(row.created_at)}</td>
                <td>${this.renderExpiry(row.expires_at, expired)}</td>
                <td>${this.renderSent(row.sent_at)}</td>
                <td><a class="aq-link" href="https://cartertraileraxles.com/quote/cart/${esc(row.quote_number)}" target="_blank" rel="noopener">Load Cart ↗</a></td>
            `);

            this.$tbody.append($tr);
        }

        this.$results.show();

        const from = (page - 1) * lim + 1;
        const to = Math.min(from + data.length - 1, total);
        this.updateCount(from, to, total);
        this.renderPagination(page, lim, total);
    }

    updateCount(from, to, total) {
        if (total === 0) {
            this.$countChip.text('0 quotes');
        } else if (this.currentQuery) {
            this.$countChip.text(`${from}–${to} of ${total}`);
        } else {
            this.$countChip.text(`${total} quote${total !== 1 ? 's' : ''}`);
        }
    }

    renderExpiry(iso, expired) {
        const d = fmtDate(iso);
        return expired
            ? `<span class="aq-badge aq-badge-expired">Expired</span> <span class="aq-cell-muted" style="font-size:11px;margin-left:4px;">${d}</span>`
            : `<span class="aq-badge aq-badge-active">Active</span> <span class="aq-cell-muted" style="font-size:11px;margin-left:4px;">${d}</span>`;
    }

    renderSent(sentAt) {
        return sentAt
            ? `<span class="aq-cell-ok">${fmtDateTime(sentAt)}</span>`
            : '<span class="aq-cell-warn">Not sent</span>';
    }

    renderPagination(page, limit, total) {
        const totalPages = Math.ceil(total / limit);
        this.$pagination.empty();
        if (totalPages <= 1) return;

        const $prev = $('<button class="button button--secondary aq-pag-btn">← Prev</button>')
            .prop('disabled', page <= 1)
            .on('click', () => this.load(page - 1));

        const $info = $(`<span class="aq-page-info">Page <strong>${page}</strong> of <strong>${totalPages}</strong></span>`);

        const $next = $('<button class="button button--secondary aq-pag-btn">Next →</button>')
            .prop('disabled', page >= totalPages)
            .on('click', () => this.load(page + 1));

        this.$pagination.append($prev, $info, $next);
    }

    setLoading(on) {
        this.$loading.toggle(on);
    }

    clearStates() {
        this.$results.hide();
        this.$empty.hide();
        this.$error.hide();
    }

    showError(msg) {
        this.$error.text(msg).show();
    }
}
