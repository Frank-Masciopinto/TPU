import { stripToText } from './forumSanitize';

const SITE_ORIGIN = 'https://trailerpartsunlimited.com';
const SITE_NAME = 'Trailer Parts Unlimited';
const FORUM_NAME = 'Trailer Q&A Forum';

// ---------------------------------------------------------------------------
// DOM helpers
// ---------------------------------------------------------------------------

function upsertJsonLd(id, obj) {
    const existing = document.getElementById(id);
    const script = existing || document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(obj);
    if (!existing) document.head.appendChild(script);
}

function removeJsonLd(id) {
    const el = document.getElementById(id);
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function upsertMeta(name, content, isProperty) {
    const attr = isProperty ? 'property' : 'name';
    let el = document.querySelector(`meta[${attr}="${name}"]`);
    if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
    }
    el.setAttribute('content', content);
}

function upsertLink(rel, href, attrs) {
    let el = document.querySelector(`link[rel="${rel}"][data-forum="true"]`);
    if (!el) {
        el = document.createElement('link');
        el.rel = rel;
        el.setAttribute('data-forum', 'true');
        document.head.appendChild(el);
    }
    el.href = href;
    if (attrs) {
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    }
}

function removeMeta(name, isProperty) {
    const attr = isProperty ? 'property' : 'name';
    const el = document.querySelector(`meta[${attr}="${name}"]`);
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

function removeLink(rel) {
    const el = document.querySelector(`link[rel="${rel}"][data-forum="true"]`);
    if (el && el.parentNode) el.parentNode.removeChild(el);
}

// ---------------------------------------------------------------------------
// Build canonical URL for a thread
// ---------------------------------------------------------------------------

function buildCanonicalUrl(thread) {
    if (thread && thread.slug) {
        return `${SITE_ORIGIN}/forum/thread?slug=${encodeURIComponent(thread.slug)}`;
    }
    if (thread && thread.id) {
        return `${SITE_ORIGIN}/forum/thread?t=${encodeURIComponent(thread.id)}`;
    }
    return `${SITE_ORIGIN}/forum`;
}

// ---------------------------------------------------------------------------
// Clear all forum SEO tags
// ---------------------------------------------------------------------------

export function clearForumSeo() {
    removeJsonLd('tpu-forum-jsonld');
    removeJsonLd('tpu-forum-breadcrumb');
    removeMeta('description');
    removeMeta('robots');
    removeMeta('og:type', true);
    removeMeta('og:title', true);
    removeMeta('og:description', true);
    removeMeta('og:url', true);
    removeMeta('og:image', true);
    removeMeta('og:site_name', true);
    removeMeta('twitter:card');
    removeMeta('twitter:title');
    removeMeta('twitter:description');
    removeLink('canonical');
}

// ---------------------------------------------------------------------------
// Feed page SEO
// ---------------------------------------------------------------------------

export function setForumFeedTitle(route) {
    document.title = `${FORUM_NAME} | ${SITE_NAME}`;
    clearForumSeo();

    upsertLink('canonical', `${SITE_ORIGIN}/forum`);
    upsertMeta('description', `Ask questions and get expert answers about trailer axles, tires, brakes, suspension, and parts compatibility from ${SITE_NAME}.`);
    upsertMeta('og:type', 'website', true);
    upsertMeta('og:title', `${FORUM_NAME} | ${SITE_NAME}`, true);
    upsertMeta('og:description', 'Expert Q&A on trailer axles, tires, hubs, brakes, and suspension. Get answers from real trailer parts specialists.', true);
    upsertMeta('og:url', `${SITE_ORIGIN}/forum`, true);
    upsertMeta('og:site_name', SITE_NAME, true);
    upsertMeta('twitter:card', 'summary');

    // Noindex filtered/search/paginated views
    if (route && (route.q || route.filter || (route.page && route.page > 1))) {
        upsertMeta('robots', 'noindex, follow');
    }

    // Feed page schema
    const feedSchema = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: FORUM_NAME,
        url: `${SITE_ORIGIN}/forum`,
        description: `Community Q&A forum for trailer parts, axles, tires, and accessories at ${SITE_NAME}.`,
        isPartOf: {
            '@type': 'WebSite',
            name: SITE_NAME,
            url: SITE_ORIGIN,
        },
    };
    upsertJsonLd('tpu-forum-jsonld', feedSchema);

    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
            { '@type': 'ListItem', position: 2, name: 'Forum', item: `${SITE_ORIGIN}/forum` },
        ],
    };
    upsertJsonLd('tpu-forum-breadcrumb', breadcrumb);
}

// ---------------------------------------------------------------------------
// Thread page SEO
// ---------------------------------------------------------------------------

export function setForumThreadSeo(thread, acceptedAnswer, suggestedAnswers) {
    if (!thread) return;

    const title = thread.title || 'Thread';
    const canonicalUrl = buildCanonicalUrl(thread);
    const questionText = stripToText(thread.bodyHtml || thread.body || '');
    const summaryText = thread.summary || '';
    const metaDesc = summaryText || (questionText.substring(0, 155) + (questionText.length > 155 ? '...' : ''));
    const commentCount = (Array.isArray(suggestedAnswers) ? suggestedAnswers.length : 0) + (acceptedAnswer ? 1 : 0);
    const hasAnswer = !!acceptedAnswer || commentCount > 0;

    // Page title
    const titleSuffix = acceptedAnswer ? ' (Answered)' : '';
    document.title = `${title}${titleSuffix} | ${FORUM_NAME} | ${SITE_NAME}`;

    // Canonical
    upsertLink('canonical', canonicalUrl);

    // Meta description
    upsertMeta('description', metaDesc);

    // Noindex thin threads (no answers, short body)
    if (!hasAnswer && questionText.length < 100) {
        upsertMeta('robots', 'noindex, follow');
    }

    // Open Graph
    upsertMeta('og:type', 'article', true);
    upsertMeta('og:title', `${title} | ${FORUM_NAME}`, true);
    upsertMeta('og:description', metaDesc, true);
    upsertMeta('og:url', canonicalUrl, true);
    upsertMeta('og:site_name', SITE_NAME, true);

    // Twitter
    upsertMeta('twitter:card', 'summary');
    upsertMeta('twitter:title', `${title} | ${FORUM_NAME}`);
    upsertMeta('twitter:description', metaDesc);

    // QAPage JSON-LD
    const qa = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: {
            '@type': 'Question',
            name: title,
            text: questionText.substring(0, 500),
            url: canonicalUrl,
            dateCreated: thread.createdAt || thread.created_at || undefined,
            dateModified: thread.updatedAt || thread.updated_at || thread.createdAt || thread.created_at || undefined,
            upvoteCount: typeof thread.score === 'number' ? thread.score : (typeof thread.votes === 'number' ? thread.votes : 0),
            answerCount: commentCount,
        },
    };

    if (acceptedAnswer) {
        qa.mainEntity.acceptedAnswer = {
            '@type': 'Answer',
            text: stripToText(acceptedAnswer.bodyHtml || acceptedAnswer.body || '').substring(0, 500),
            dateCreated: acceptedAnswer.createdAt || acceptedAnswer.created_at || undefined,
            upvoteCount: typeof acceptedAnswer.score === 'number' ? acceptedAnswer.score : (typeof acceptedAnswer.votes === 'number' ? acceptedAnswer.votes : 0),
        };
    }

    if (Array.isArray(suggestedAnswers) && suggestedAnswers.length) {
        qa.mainEntity.suggestedAnswer = suggestedAnswers.slice(0, 5).map((a) => ({
            '@type': 'Answer',
            text: stripToText(a.bodyHtml || a.body || '').substring(0, 500),
            dateCreated: a.createdAt || a.created_at || undefined,
            upvoteCount: typeof a.score === 'number' ? a.score : (typeof a.votes === 'number' ? a.votes : 0),
        }));
    }

    upsertJsonLd('tpu-forum-jsonld', qa);

    // BreadcrumbList JSON-LD
    const breadcrumb = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_ORIGIN },
            { '@type': 'ListItem', position: 2, name: 'Forum', item: `${SITE_ORIGIN}/forum` },
            { '@type': 'ListItem', position: 3, name: title, item: canonicalUrl },
        ],
    };
    upsertJsonLd('tpu-forum-breadcrumb', breadcrumb);
}
