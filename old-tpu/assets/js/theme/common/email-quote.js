const QUOTE_API = 'https://cartertraileraxles.com/quote/send';
const CART_API = '/api/storefront/carts?include=lineItems.physicalItems.options,lineItems.digitalItems.options';

function formatPrice(value) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

function transformCart(apiCart) {
    const physical = apiCart.lineItems.physicalItems || [];
    const digital = apiCart.lineItems.digitalItems || [];
    const items = [...physical, ...digital].map(item => {
        const priceVal = item.salePrice ?? item.listPrice ?? 0;
        const totalVal = item.extendedSalePrice ?? 0;
        return {
            id: item.id,
            product_id: item.productId,
            name: item.name || 'Unknown Product',
            sku: item.sku || '',
            quantity: item.quantity || 1,
            price: { value: priceVal, formatted: formatPrice(priceVal) },
            total: { value: totalVal, formatted: formatPrice(totalVal) },
            image: item.imageUrl || '',
            url: item.url || '#',
            options: (item.options || []).map(o => ({ name: o.name, value: o.value })),
        };
    });

    return {
        id: apiCart.id,
        items,
        quantity: items.reduce((s, i) => s + i.quantity, 0),
        subTotal: apiCart.baseAmount,
        subTotalFormatted: formatPrice(apiCart.baseAmount),
        grandTotal: apiCart.cartAmount,
        grandTotalFormatted: formatPrice(apiCart.cartAmount),
        discount: apiCart.discountAmount > 0 ? apiCart.discountAmount : 0,
    };
}

function buildPanelHTML() {
    return `
    <div class="eq-overlay" data-eq-overlay></div>
    <div class="eq-panel" data-eq-panel>
        <button type="button" class="eq-panel__close" data-eq-close aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>

        <div class="eq-panel__body" data-eq-body>
            <!-- Form state -->
            <div data-eq-form-view>
                <div class="eq-panel__header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                    <h3 class="eq-panel__title">Email Quote</h3>
                    <p class="eq-panel__desc">Get a copy of your cart emailed to you. Quote is valid for 30 days.</p>
                </div>

                <div class="eq-panel__preview" data-eq-preview></div>

                <form class="eq-panel__form" data-eq-form>
                    <div class="eq-field">
                        <label class="eq-field__label" for="eq-email">Email Address <span class="eq-field__req">*</span></label>
                        <input class="eq-field__input" type="email" id="eq-email" name="email" placeholder="you@example.com" required />
                    </div>
                    <div class="eq-field">
                        <label class="eq-field__label" for="eq-name">Your Name <span class="eq-field__opt">(optional)</span></label>
                        <input class="eq-field__input" type="text" id="eq-name" name="name" placeholder="John Smith" />
                    </div>
                    <div class="eq-field">
                        <label class="eq-field__label" for="eq-phone">Phone Number <span class="eq-field__opt">(optional)</span></label>
                        <input class="eq-field__input" type="tel" id="eq-phone" name="phone" placeholder="(555) 123-4567" />
                    </div>
                    <div class="eq-field">
                        <label class="eq-field__label" for="eq-notes">Notes <span class="eq-field__opt">(optional)</span></label>
                        <textarea class="eq-field__input eq-field__textarea" id="eq-notes" name="notes" rows="3" placeholder="Any special requests or questions?"></textarea>
                    </div>

                    <div class="eq-panel__error" data-eq-error hidden></div>

                    <button type="submit" class="eq-panel__submit" data-eq-submit>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                        <span data-eq-submit-text>Send Quote to Email</span>
                    </button>

                    <p class="eq-panel__privacy">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                        We respect your privacy. Your email will only be used to send this quote.
                    </p>
                </form>
            </div>

            <!-- Success state -->
            <div data-eq-success-view hidden>
                <div class="eq-success">
                    <div class="eq-success__icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                    </div>
                    <h3 class="eq-success__title">Quote Sent!</h3>
                    <p class="eq-success__desc">We've emailed your quote to <strong data-eq-success-email></strong></p>
                    <div class="eq-success__details">
                        <div class="eq-success__row"><span>Quote Number</span><strong data-eq-success-number></strong></div>
                        <div class="eq-success__row"><span>Valid Until</span><strong data-eq-success-expires></strong></div>
                        <div class="eq-success__row"><span>Total</span><strong data-eq-success-total></strong></div>
                    </div>
                    <p class="eq-success__note">Check your inbox (and spam folder) for your quote. You can complete your order anytime within 30 days.</p>
                    <button type="button" class="eq-panel__submit" data-eq-close>Got it, thanks!</button>
                </div>
            </div>
        </div>
    </div>`;
}

function buildPreviewHTML(cart) {
    const itemsHTML = cart.items.slice(0, 3).map(item => `
        <div class="eq-preview__item">
            ${item.image ? `<img class="eq-preview__img" src="${item.image}" alt="${item.name}" />` : ''}
            <div class="eq-preview__info">
                <span class="eq-preview__name">${item.name}</span>
                <span class="eq-preview__qty">Qty: ${item.quantity}</span>
            </div>
            <span class="eq-preview__price">${item.total.formatted}</span>
        </div>
    `).join('');

    const moreHTML = cart.items.length > 3
        ? `<div class="eq-preview__more">+ ${cart.items.length - 3} more items</div>`
        : '';

    return `
        <div class="eq-preview__header">
            <span class="eq-preview__label">Your Quote</span>
            <span class="eq-preview__count">${cart.items.length} ${cart.items.length === 1 ? 'item' : 'items'}</span>
        </div>
        ${itemsHTML}
        ${moreHTML}
        <div class="eq-preview__total">
            <span>Quote Total</span>
            <strong>${cart.grandTotalFormatted}</strong>
        </div>
    `;
}

let panelEl = null;
let currentCart = null;

function getOrCreatePanel() {
    if (panelEl) return panelEl;

    const wrapper = document.createElement('div');
    wrapper.id = 'email-quote-panel';
    wrapper.innerHTML = buildPanelHTML();
    document.body.appendChild(wrapper);
    panelEl = wrapper;

    wrapper.querySelectorAll('[data-eq-close], [data-eq-overlay]').forEach(el => {
        el.addEventListener('click', closePanel);
    });

    wrapper.querySelector('[data-eq-form]').addEventListener('submit', handleSubmit);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && wrapper.classList.contains('is-open')) closePanel();
    });

    return wrapper;
}

async function fetchCart() {
    const res = await fetch(CART_API, { credentials: 'include' });
    const carts = await res.json();
    if (carts && carts.length > 0) return transformCart(carts[0]);
    return null;
}

function openPanel(customer) {
    const panel = getOrCreatePanel();

    panel.querySelector('[data-eq-form-view]').hidden = false;
    panel.querySelector('[data-eq-success-view]').hidden = true;
    panel.querySelector('[data-eq-error]').hidden = true;
    panel.querySelector('[data-eq-form]').reset();

    if (customer?.email) panel.querySelector('#eq-email').value = customer.email;
    if (customer?.name) panel.querySelector('#eq-name').value = customer.name;

    panel.querySelector('[data-eq-preview]').innerHTML = '<div class="eq-preview__loading">Loading cart...</div>';

    requestAnimationFrame(() => panel.classList.add('is-open'));
    document.body.style.overflow = 'hidden';

    fetchCart().then(cart => {
        currentCart = cart;
        if (cart) {
            panel.querySelector('[data-eq-preview]').innerHTML = buildPreviewHTML(cart);
        } else {
            panel.querySelector('[data-eq-preview]').innerHTML = '<div class="eq-preview__loading">Could not load cart</div>';
        }
    });
}

function closePanel() {
    if (!panelEl) return;
    panelEl.classList.remove('is-open');
    document.body.style.overflow = '';
}

function showError(msg) {
    const el = panelEl.querySelector('[data-eq-error]');
    el.textContent = msg;
    el.hidden = false;
}

async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const email = form.email.value.trim();
    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const notes = form.notes.value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        showError('Please enter a valid email address');
        return;
    }

    if (!currentCart || !currentCart.items.length) {
        showError('Your cart is empty');
        return;
    }

    const submitBtn = panelEl.querySelector('[data-eq-submit]');
    const submitText = panelEl.querySelector('[data-eq-submit-text]');
    const errorEl = panelEl.querySelector('[data-eq-error]');

    submitBtn.disabled = true;
    submitText.textContent = 'Sending Quote...';
    errorEl.hidden = true;

    try {
        const payload = {
            email: email.toLowerCase(),
            name: name || undefined,
            phone: phone || undefined,
            notes: notes || undefined,
            cart: {
                id: currentCart.id,
                items: currentCart.items.map(item => ({
                    id: item.id,
                    product_id: item.product_id,
                    name: item.name,
                    sku: item.sku,
                    quantity: item.quantity,
                    price: item.price,
                    total: item.total,
                    image: item.image,
                    options: item.options,
                    url: item.url,
                })),
                subtotal: { value: currentCart.subTotal, formatted: currentCart.subTotalFormatted },
                grand_total: { value: currentCart.grandTotal, formatted: currentCart.grandTotalFormatted },
            },
        };

        const res = await fetch(QUOTE_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const result = await res.json();
        if (!res.ok || !result.success) throw new Error(result.error || 'Failed to send quote');

        showSuccess(result);

        if (typeof window !== 'undefined' && window.dataLayer) {
            window.dataLayer.push({
                event: 'quote_sent',
                quote_number: result.quoteNumber,
                quote_total: currentCart.grandTotal,
                quote_items: currentCart.items.length,
            });
        }
    } catch (err) {
        showError(err.message || 'Something went wrong. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitText.textContent = 'Send Quote to Email';
    }
}

function showSuccess(result) {
    const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

    panelEl.querySelector('[data-eq-form-view]').hidden = true;
    panelEl.querySelector('[data-eq-success-view]').hidden = false;
    panelEl.querySelector('[data-eq-success-email]').textContent = result.email;
    panelEl.querySelector('[data-eq-success-number]').textContent = result.quoteNumber;
    panelEl.querySelector('[data-eq-success-expires]').textContent = formatDate(result.expiresAt);
    panelEl.querySelector('[data-eq-success-total]').textContent = currentCart.grandTotalFormatted;
}

export function initEmailQuote($modalContent, customer) {
    const $btn = $modalContent.find('[data-preview-email-quote]');
    if (!$btn.length) return;

    $btn.on('click', () => openPanel(customer));
}

export function initCartPageEmailQuote(customer) {
    const btn = document.querySelector('[data-cart-email-quote]');
    if (!btn) return;

    btn.addEventListener('click', () => openPanel(customer));
}

export default initEmailQuote;
