import DOMPurify from 'dompurify';

const ALLOWED_TAGS = [
    'p', 'br', 'div', 'span',
    'strong', 'em', 'b', 'i', 'u',
    'ul', 'ol', 'li',
    'blockquote', 'code', 'pre',
    'h1', 'h2', 'h3', 'h4',
    'a',
];

const ALLOWED_ATTR = [
    'href', 'title', 'target', 'rel',
];

let linkHookInstalled = false;

export function sanitizeUserHtml(dirtyHtml) {
    const html = typeof dirtyHtml === 'string' ? dirtyHtml : '';

    if (!linkHookInstalled) {
        linkHookInstalled = true;
        DOMPurify.addHook('afterSanitizeAttributes', (node) => {
            if (!node || node.tagName !== 'A') return;

            const href = node.getAttribute('href') || '';
            // Ensure safe rel for any link.
            node.setAttribute('rel', 'noopener noreferrer');

            // Only force new tab for explicit http(s) links.
            if (/^https?:\/\//i.test(href)) {
                node.setAttribute('target', '_blank');
            }
        });
    }

    return DOMPurify.sanitize(html, {
        ALLOWED_TAGS,
        ALLOWED_ATTR,
        // Prevent SVG/MathML-based XSS vectors
        USE_PROFILES: { html: true },
    });
}

export function stripToText(html) {
    const safe = sanitizeUserHtml(html);
    try {
        const doc = new DOMParser().parseFromString(safe, 'text/html');
        return (doc.body && doc.body.textContent) ? doc.body.textContent.trim() : '';
    } catch (e) {
        return String(safe).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    }
}

