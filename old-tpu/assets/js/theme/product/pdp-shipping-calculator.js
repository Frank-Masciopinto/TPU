import utils from '@bigcommerce/stencil-utils';

const SHIPPING_LOCATION_KEY = 'tpu_shipping_location';

const US_STATES = [
    { id: 1, name: 'Alabama', abbr: 'AL' },
    { id: 2, name: 'Alaska', abbr: 'AK' },
    { id: 4, name: 'Arizona', abbr: 'AZ' },
    { id: 5, name: 'Arkansas', abbr: 'AR' },
    { id: 12, name: 'California', abbr: 'CA' },
    { id: 13, name: 'Colorado', abbr: 'CO' },
    { id: 14, name: 'Connecticut', abbr: 'CT' },
    { id: 15, name: 'Delaware', abbr: 'DE' },
    { id: 16, name: 'District of Columbia', abbr: 'DC' },
    { id: 18, name: 'Florida', abbr: 'FL' },
    { id: 19, name: 'Georgia', abbr: 'GA' },
    { id: 21, name: 'Hawaii', abbr: 'HI' },
    { id: 22, name: 'Idaho', abbr: 'ID' },
    { id: 23, name: 'Illinois', abbr: 'IL' },
    { id: 24, name: 'Indiana', abbr: 'IN' },
    { id: 25, name: 'Iowa', abbr: 'IA' },
    { id: 26, name: 'Kansas', abbr: 'KS' },
    { id: 27, name: 'Kentucky', abbr: 'KY' },
    { id: 28, name: 'Louisiana', abbr: 'LA' },
    { id: 29, name: 'Maine', abbr: 'ME' },
    { id: 31, name: 'Maryland', abbr: 'MD' },
    { id: 32, name: 'Massachusetts', abbr: 'MA' },
    { id: 33, name: 'Michigan', abbr: 'MI' },
    { id: 34, name: 'Minnesota', abbr: 'MN' },
    { id: 35, name: 'Mississippi', abbr: 'MS' },
    { id: 36, name: 'Missouri', abbr: 'MO' },
    { id: 37, name: 'Montana', abbr: 'MT' },
    { id: 38, name: 'Nebraska', abbr: 'NE' },
    { id: 39, name: 'Nevada', abbr: 'NV' },
    { id: 40, name: 'New Hampshire', abbr: 'NH' },
    { id: 41, name: 'New Jersey', abbr: 'NJ' },
    { id: 42, name: 'New Mexico', abbr: 'NM' },
    { id: 43, name: 'New York', abbr: 'NY' },
    { id: 44, name: 'North Carolina', abbr: 'NC' },
    { id: 45, name: 'North Dakota', abbr: 'ND' },
    { id: 47, name: 'Ohio', abbr: 'OH' },
    { id: 48, name: 'Oklahoma', abbr: 'OK' },
    { id: 49, name: 'Oregon', abbr: 'OR' },
    { id: 51, name: 'Pennsylvania', abbr: 'PA' },
    { id: 53, name: 'Rhode Island', abbr: 'RI' },
    { id: 54, name: 'South Carolina', abbr: 'SC' },
    { id: 55, name: 'South Dakota', abbr: 'SD' },
    { id: 56, name: 'Tennessee', abbr: 'TN' },
    { id: 57, name: 'Texas', abbr: 'TX' },
    { id: 58, name: 'Utah', abbr: 'UT' },
    { id: 59, name: 'Vermont', abbr: 'VT' },
    { id: 61, name: 'Virginia', abbr: 'VA' },
    { id: 62, name: 'Washington', abbr: 'WA' },
    { id: 63, name: 'West Virginia', abbr: 'WV' },
    { id: 64, name: 'Wisconsin', abbr: 'WI' },
    { id: 65, name: 'Wyoming', abbr: 'WY' },
];

/**
 * PDPShippingCalculator - Estimate shipping costs on the PDP by state and ZIP.
 * Silently adds/removes a cart item to fetch BigCommerce shipping quotes.
 * Persists chosen location to localStorage for reuse across product pages.
 */
export default class PDPShippingCalculator {
    constructor($container, context) {
        this.$container = $container;
        this.context = context;
        this.productId = $('form[data-cart-item-add] input[name="product_id"]').val();
        this.minQty = parseInt($('form[data-cart-item-add] input[name="qty[]"]').val(), 10) || 1;

        this.isEditing = false;
        this.isLoading = false;
        this.selectedState = '';
        this.zipCode = '';
        this.quotes = null;
        this.recalcTimer = null;

        this.$title = $container.find('[data-calc-title]');
        this.$editBtn = $container.find('[data-calc-edit]');
        this.$form = $container.find('[data-calc-form]');
        this.$stateSelect = $container.find('[data-calc-state]');
        this.$zipInput = $container.find('[data-calc-zip]');
        this.$submitBtn = $container.find('[data-calc-submit]');
        this.$error = $container.find('[data-calc-error]');
        this.$loading = $container.find('[data-calc-loading]');
        this.$results = $container.find('[data-calc-results]');
        this.$empty = $container.find('[data-calc-empty]');

        this.populateStateOptions();
        this.bindEvents();
        this.loadSavedLocation();
    }

    populateStateOptions() {
        const fragment = document.createDocumentFragment();
        US_STATES.forEach(state => {
            const opt = document.createElement('option');
            opt.value = state.id;
            opt.textContent = state.name;
            fragment.appendChild(opt);
        });
        this.$stateSelect.append(fragment);
    }

    bindEvents() {
        this.$submitBtn.on('click', e => {
            e.preventDefault();
            e.stopPropagation();
            if (this.canSubmit()) {
                this.calculateShipping(this.selectedState, this.zipCode, true);
            }
        });

        this.$editBtn.on('click', () => {
            this.showForm();
            this.clearError();
        });

        this.$stateSelect.on('change', () => {
            this.selectedState = this.$stateSelect.val();
            this.updateSubmitState();
        });

        this.$zipInput.on('input', () => {
            this.zipCode = this.$zipInput.val().replace(/\D/g, '').slice(0, 5);
            this.$zipInput.val(this.zipCode);
            this.$zipInput.toggleClass('has-error', this.zipCode.length > 0 && !this.isValidZip());
            this.updateSubmitState();
        });

        this.$zipInput.on('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                e.stopPropagation();
                if (this.canSubmit()) {
                    this.calculateShipping(this.selectedState, this.zipCode, true);
                }
            }
        });

        $('body').on('shippingCalc:optionsChanged', () => this.onOptionsChanged());
    }

    loadSavedLocation() {
        const saved = getSavedShippingLocation();
        if (saved && saved.stateId && saved.zip) {
            this.selectedState = saved.stateId.toString();
            this.zipCode = saved.zip;
            this.$stateSelect.val(this.selectedState);
            this.$zipInput.val(this.zipCode);
            this.calculateShipping(saved.stateId, saved.zip, false);
        } else {
            this.showForm();
        }
    }

    onOptionsChanged() {
        this.clearError();

        if (this.selectedState && this.zipCode && this.isValidZip()) {
            clearTimeout(this.recalcTimer);
            this.recalcTimer = setTimeout(() => {
                this.calculateShipping(this.selectedState, this.zipCode, false);
            }, 500);
        }
    }

    // --- Validation helpers ---

    isValidZip() {
        return /^\d{5}$/.test(this.zipCode);
    }

    canSubmit() {
        return this.selectedState && this.isValidZip() && !this.isLoading;
    }

    updateSubmitState() {
        this.$submitBtn.prop('disabled', !this.canSubmit());
    }

    getStateName(stateId) {
        const state = US_STATES.find(s => s.id.toString() === stateId?.toString());
        return state ? state.abbr : '';
    }

    /**
     * Read current product option selections from the add-to-cart form.
     * Returns an object of { attributeId: value } pairs.
     */
    getOptionSelections() {
        const options = {};
        const $form = $('form[data-cart-item-add]');
        $form.find('[name^="attribute["]').each((_, el) => {
            const $el = $(el);
            const name = $el.attr('name');
            const match = name.match(/attribute\[(\d+)\]/);
            if (!match) return;

            const attrId = match[1];
            if ($el.is(':radio') || $el.is(':checkbox')) {
                if ($el.is(':checked')) {
                    options[attrId] = $el.val();
                }
            } else {
                const val = $el.val();
                if (val !== undefined && val !== null && val !== '') {
                    options[attrId] = val;
                }
            }
        });
        return options;
    }

    // --- Core API flow ---

    /**
     * Three-step flow: add temp cart item -> fetch quotes -> remove temp item.
     * Keeps the real cart unaffected.
     */
    async calculateShipping(stateId, zip, shouldSave = true) {
        if (!this.productId) return;

        this.isLoading = true;
        this.showLoading();
        this.clearError();
        this.updateSubmitState();

        try {
            const options = this.getOptionSelections();

            // Build form data matching stencil-utils expectations
            const formData = new FormData();
            formData.append('action', 'add');
            formData.append('product_id', this.productId);
            formData.append('qty[]', this.minQty);

            Object.entries(options).forEach(([optionId, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    formData.append(`attribute[${optionId}]`, value);
                }
            });

            // Step 1: add product to cart
            const addResult = await new Promise((resolve, reject) => {
                utils.api.cart.itemAdd(formData, (err, response) => {
                    if (err) return reject(new Error(err.message || 'Failed to add item'));
                    if (response && response.data && response.data.error) {
                        return reject(new Error(response.data.error));
                    }
                    resolve(response);
                });
            });

            const cartItemId = addResult && addResult.data && addResult.data.cart_item
                ? addResult.data.cart_item.id
                : null;

            // Step 2: get shipping quotes
            const shippingParams = {
                country_id: 226,
                state_id: stateId,
                zip_code: zip,
            };

            const quotesResult = await new Promise((resolve, reject) => {
                utils.api.cart.getShippingQuotes(shippingParams, 'cart/shipping-quotes', (err, response) => {
                    if (err) return reject(new Error('Failed to get shipping quotes'));
                    resolve(response);
                });
            });

            // Step 3: remove temp cart item
            if (cartItemId) {
                await new Promise(resolve => {
                    utils.api.cart.itemRemove(cartItemId, () => resolve());
                });
            }

            const quotes = this.parseShippingQuotes(
                (quotesResult && quotesResult.content) || quotesResult,
            );
            this.quotes = quotes;

            if (shouldSave) {
                const stateObj = US_STATES.find(s => s.id.toString() === stateId?.toString());
                saveShippingLocation({
                    state: stateObj ? stateObj.name : '',
                    stateId: parseInt(stateId, 10),
                    zip,
                });
            }

            this.hideForm();
            this.renderQuotes(quotes);
        } catch (err) {
            console.error('[ShippingCalc] Error:', err);
            this.showError(err.message || 'Unable to calculate shipping');
            this.quotes = null;
            this.hideResults();
        } finally {
            this.isLoading = false;
            this.hideLoading();
            this.updateSubmitState();
        }
    }

    /**
     * Parse the BigCommerce shipping-quotes HTML into a simple array.
     */
    parseShippingQuotes(htmlContent) {
        if (!htmlContent) return [];

        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            const quotes = [];

            doc.querySelectorAll('.estimator-form-row, li').forEach(item => {
                const labelEl = item.querySelector('.estimator-form-label-text, label');
                const priceEl = item.querySelector('.estimator-form-input--price b, .price');
                const inputEl = item.querySelector('input[type="radio"]');

                if (labelEl && priceEl) {
                    const name = (labelEl.textContent || '').trim();
                    const price = (priceEl.textContent || '').trim();
                    const id = inputEl ? inputEl.value : '';

                    if (name && price) {
                        quotes.push({ id, name, price });
                    }
                }
            });

            if (quotes.length === 0) {
                const text = (doc.body && doc.body.textContent) || '';
                const priceMatches = text.match(/\$[\d,.]+/g);
                if (priceMatches && priceMatches.length > 0) {
                    quotes.push({ id: 'fallback', name: 'Shipping', price: priceMatches[0] });
                }
            }

            return quotes;
        } catch (err) {
            console.error('[ShippingCalc] Parse error:', err);
            return [];
        }
    }

    // --- DOM manipulation ---

    renderQuotes(quotes) {
        this.$results.empty();
        this.$empty.hide();

        if (quotes.length === 0) {
            this.$results.hide();
            this.$empty.show();
            return;
        }

        quotes.forEach(quote => {
            const $option = $(
                `<div class="pdp-shipping-calc__option">
                    <span class="pdp-shipping-calc__option-name"></span>
                    <span class="pdp-shipping-calc__option-price"></span>
                </div>`,
            );
            $option.find('.pdp-shipping-calc__option-name').text(quote.name);
            $option.find('.pdp-shipping-calc__option-price').text(quote.price);
            this.$results.append($option);
        });

        this.$results.show();
        this.updateTitle();
    }

    updateTitle() {
        if (!this.isEditing && this.quotes && this.selectedState && this.zipCode) {
            const abbr = this.getStateName(this.selectedState);
            this.$title.html(`Shipping to <strong>${abbr} ${this.zipCode}</strong>`);
            this.$editBtn.show();
        } else {
            this.$title.text('Calculate Shipping');
            this.$editBtn.hide();
        }
    }

    showForm() {
        this.isEditing = true;
        this.$form.show();
        this.updateTitle();
        this.updateSubmitState();
    }

    hideForm() {
        this.isEditing = false;
        this.$form.hide();
        this.updateTitle();
    }

    showLoading() {
        if (!this.isEditing) {
            this.$loading.show();
        }
        this.$submitBtn.find('[data-calc-btn-text]').text('');
        this.$submitBtn.find('[data-calc-btn-spinner]').show();
    }

    hideLoading() {
        this.$loading.hide();
        this.$submitBtn.find('[data-calc-btn-text]').text('Get Rates');
        this.$submitBtn.find('[data-calc-btn-spinner]').hide();
    }

    showError(message) {
        this.$error.text(message).show();
    }

    clearError() {
        this.$error.text('').hide();
    }

    hideResults() {
        this.$results.hide();
        this.$empty.hide();
    }
}

// --- localStorage helpers ---

function getSavedShippingLocation() {
    try {
        const saved = localStorage.getItem(SHIPPING_LOCATION_KEY);
        if (!saved) return null;

        const parsed = JSON.parse(saved);
        if (!parsed.stateId || !parsed.zip) return null;

        return parsed;
    } catch (err) {
        return null;
    }
}

function saveShippingLocation(location) {
    try {
        localStorage.setItem(SHIPPING_LOCATION_KEY, JSON.stringify({
            state: location.state || '',
            stateId: location.stateId,
            zip: location.zip,
            timestamp: Date.now(),
        }));
    } catch (err) {
        // localStorage may be unavailable
    }
}
