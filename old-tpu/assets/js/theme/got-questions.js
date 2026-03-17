import PageManager from './page-manager';

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
const CONTACT_API = `${isLocal ? 'http://localhost:8787' : 'https://cartertraileraxles.com'}/contact/send`;

const SUBJECT_HINTS = {
    'Order Status': 'Tip: including your order number above speeds up our reply.',
};

function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export default class GotQuestions extends PageManager {
    onReady() {
        this.$form    = $('[data-contact-form]');
        this.$success = $('[data-contact-success]');
        this.$error   = $('[data-contact-error]');
        this.$submit  = $('[data-submit-btn]');
        this.$counter = $('[data-char-counter]');
        this.$hint    = $('[data-subject-hint]');
        this.$message = $('#cf-message');
        this.$subject = $('#cf-subject');

        if (!this.$form.length) return;

        this.bindForm();
        this.bindCharCounter();
        this.bindSubjectHint();
        this.bindReset();
    }

    bindForm() {
        this.$form.on('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        this.clearError();

        const name    = $('#cf-name').val().toString().trim();
        const email   = $('#cf-email').val().toString().trim();
        const phone   = $('#cf-phone').val().toString().trim();
        const subject = this.$subject.val().toString().trim();
        const order   = $('#cf-order').val().toString().trim();
        const message = this.$message.val().toString().trim();
        const website = $('[name="website"]').val().toString(); // honeypot

        // Client-side validation
        if (!name) {
            this.showError('Please enter your full name.');
            $('#cf-name').trigger('focus');
            return;
        }
        if (!validateEmail(email)) {
            this.showError('Please enter a valid email address.');
            $('#cf-email').trigger('focus');
            return;
        }
        if (!subject) {
            this.showError('Please select a subject.');
            this.$subject.trigger('focus');
            return;
        }
        if (message.length < 10) {
            this.showError('Please enter a message (at least 10 characters).');
            this.$message.trigger('focus');
            return;
        }

        this.setLoading(true);

        try {
            const res = await fetch(CONTACT_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, phone, subject, order, message, website }),
            });

            const data = await res.json().catch(() => ({}));

            if (!res.ok || !data.success) {
                const msg = res.status === 429
                    ? 'Too many submissions. Please wait a moment and try again.'
                    : 'Something went wrong. Please try again or call us directly.';
                this.showError(msg);
                this.setLoading(false);
                return;
            }

            this.showSuccess(email);
        } catch {
            this.showError('Unable to send your message. Please check your connection and try again.');
            this.setLoading(false);
        }
    }

    showSuccess(email) {
        this.$form.hide();
        $('[data-success-email]').text(email);
        this.$success.removeAttr('hidden').show();
        this.$success[0]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showError(msg) {
        this.$error.text(msg).removeAttr('hidden').show();
        this.$error[0]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    clearError() {
        this.$error.text('').attr('hidden', '').hide();
    }

    setLoading(loading) {
        if (loading) {
            this.$submit.text('Sending...').prop('disabled', true).addClass('button--loading');
        } else {
            this.$submit.text('Send Message').prop('disabled', false).removeClass('button--loading');
        }
    }

    bindCharCounter() {
        const $counter = this.$counter;
        const $textarea = this.$message;
        const max = parseInt($textarea.attr('maxlength') || '1000', 10);

        const update = () => {
            const len = $textarea.val().toString().length;
            $counter.text(`${len} / ${max}`);
            $counter.toggleClass('tpu-cf__counter--warn', len >= max - 50);
        };

        $textarea.on('input', update);
        update();
    }

    bindSubjectHint() {
        this.$subject.on('change', () => {
            const val = this.$subject.val().toString();
            const hint = SUBJECT_HINTS[val];
            if (hint) {
                this.$hint.text(hint).addClass('is-visible');
            } else {
                this.$hint.removeClass('is-visible');
            }
        });
    }

    bindReset() {
        $('[data-reset-form]').on('click', () => {
            this.$form[0]?.reset();
            this.$counter.text('0 / 1000').removeClass('tpu-cf__counter--warn');
            this.$hint.removeClass('is-visible');
            this.clearError();
            this.setLoading(false);
            this.$success.attr('hidden', '').hide();
            this.$form.show();
            $('#cf-name').trigger('focus');
        });
    }
}
