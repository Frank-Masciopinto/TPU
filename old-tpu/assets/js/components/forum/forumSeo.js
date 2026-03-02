import { stripToText } from './forumSanitize';

function upsertJsonLd(id, obj) {
    const existing = document.getElementById(id);
    const script = existing || document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(obj);
    if (!existing) document.head.appendChild(script);
}

export function clearForumSeo() {
    const script = document.getElementById('tpu-forum-jsonld');
    if (script && script.parentNode) script.parentNode.removeChild(script);
}

export function setForumFeedTitle() {
    document.title = 'Trailer Q&A Forum';
    clearForumSeo();
}

export function setForumThreadSeo(thread, acceptedAnswer, suggestedAnswers) {
    if (!thread) return;

    const title = thread.title || 'Thread';
    document.title = `${title} | Trailer Q&A Forum`;

    const questionText = stripToText(thread.bodyHtml || thread.body || '');

    const qa = {
        '@context': 'https://schema.org',
        '@type': 'QAPage',
        mainEntity: {
            '@type': 'Question',
            name: title,
            text: questionText,
            dateCreated: thread.createdAt || thread.created_at || undefined,
            upvoteCount: typeof thread.votes === 'number' ? thread.votes : undefined,
            answerCount: Array.isArray(suggestedAnswers) ? suggestedAnswers.length : undefined,
        },
    };

    if (acceptedAnswer) {
        qa.mainEntity.acceptedAnswer = {
            '@type': 'Answer',
            text: stripToText(acceptedAnswer.bodyHtml || acceptedAnswer.body || ''),
            dateCreated: acceptedAnswer.createdAt || acceptedAnswer.created_at || undefined,
            upvoteCount: typeof acceptedAnswer.votes === 'number' ? acceptedAnswer.votes : undefined,
        };
    }

    if (Array.isArray(suggestedAnswers) && suggestedAnswers.length) {
        qa.mainEntity.suggestedAnswer = suggestedAnswers.map((a) => ({
            '@type': 'Answer',
            text: stripToText(a.bodyHtml || a.body || ''),
            dateCreated: a.createdAt || a.created_at || undefined,
            upvoteCount: typeof a.votes === 'number' ? a.votes : undefined,
        }));
    }

    upsertJsonLd('tpu-forum-jsonld', qa);
}

