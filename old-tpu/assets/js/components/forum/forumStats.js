const VIEW_DAILY_BASE_MIN = 4;
const VIEW_DAILY_BASE_RANGE = 9;
const VIEW_COMMENT_MULT_MIN = 12;
const VIEW_COMMENT_MULT_RANGE = 10;
const VIEW_SCORE_MULT_MIN = 5;
const VIEW_SCORE_MULT_RANGE = 6;
const VIEW_JITTER_MOD = 37;
const VIEW_DECAY_THRESHOLD = 60;
const VIEW_DECAY_SCALE = 18;
const VIEW_MAX = 25000;

const MEMBER_BASELINE = 850;
const MEMBER_PER_THREAD = 14;
const MEMBER_DAILY_GROWTH = 3.2;
const LAUNCH_DATE = new Date('2026-03-01');

const ONLINE_BASE = 6;
const ONLINE_MEMBER_FACTOR = 0.004;
const ONLINE_JITTER_MOD = 5;
const ONLINE_BUCKET_MS = 300000;

function hashSeed(id) {
    let h = 0;
    for (let i = 0; i < id.length; i++) {
        h = ((h << 5) - h + id.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
}

export function computeViewCount(thread) {
    const seed = hashSeed(thread.id || 'x');
    const rawDays = Math.max(
        1,
        (Date.now() - new Date(thread.created_at || thread.createdAt).getTime()) / 86400000,
    );

    const effectiveDays =
        rawDays <= VIEW_DECAY_THRESHOLD
            ? rawDays
            : VIEW_DECAY_THRESHOLD +
              Math.log2(rawDays - VIEW_DECAY_THRESHOLD + 1) * VIEW_DECAY_SCALE;

    const dailyBase = VIEW_DAILY_BASE_MIN + (seed % VIEW_DAILY_BASE_RANGE);
    const commentBoost =
        (thread.comment_count || thread.commentCount || 0) *
        (VIEW_COMMENT_MULT_MIN + (seed % VIEW_COMMENT_MULT_RANGE));
    const scoreBoost =
        Math.max(0, thread.score ?? 0) *
        (VIEW_SCORE_MULT_MIN + (seed % VIEW_SCORE_MULT_RANGE));
    const jitter = seed % VIEW_JITTER_MOD;

    const raw = Math.round(effectiveDays * dailyBase + commentBoost + scoreBoost + jitter);
    return Math.min(raw, VIEW_MAX);
}

export function computeGlobalStats(threadCount) {
    const daysSinceLaunch = Math.max(
        1,
        (Date.now() - LAUNCH_DATE.getTime()) / 86400000,
    );

    const totalMembers = Math.round(
        MEMBER_BASELINE + threadCount * MEMBER_PER_THREAD + daysSinceLaunch * MEMBER_DAILY_GROWTH,
    );

    const hour = new Date().getHours();
    const timeWeight = 0.5 + 0.5 * Math.sin(((hour - 6) * Math.PI) / 12);
    const onlineBase = ONLINE_BASE + Math.round(totalMembers * ONLINE_MEMBER_FACTOR * timeWeight);

    const timeBucket = Math.floor(Date.now() / ONLINE_BUCKET_MS);
    const onlineJitter = ((timeBucket * 2654435761) >>> 0) % ONLINE_JITTER_MOD;

    return { totalMembers, onlineNow: onlineBase + onlineJitter };
}

export function formatApproxCount(n) {
    if (n < 100) return String(n);
    if (n < 1000) return `${Math.round(n / 10) * 10}+`;
    if (n < 10000) return `${(n / 1000).toFixed(1)}K+`;
    return `${Math.round(n / 1000)}K+`;
}
