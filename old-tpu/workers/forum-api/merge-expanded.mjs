#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { randomUUID, createHash } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGINAL_PATH = join(__dirname, 'forum-threads-export.json');
const EXPANDED_PATH = join(__dirname, 'forum-threads-expanded.json');

function deterministicUserId(username) {
  return createHash('sha256').update(`forum-user-${username}`).digest('hex').slice(0, 8) +
    '-' + createHash('sha256').update(`forum-user-${username}`).digest('hex').slice(8, 12) +
    '-4' + createHash('sha256').update(`forum-user-${username}`).digest('hex').slice(13, 16) +
    '-a' + createHash('sha256').update(`forum-user-${username}`).digest('hex').slice(17, 20) +
    '-' + createHash('sha256').update(`forum-user-${username}`).digest('hex').slice(20, 32);
}

function staggerTimestamp(baseIso, index, totalComments) {
  const base = new Date(baseIso);
  const hoursSpread = 72;
  const intervalMs = (hoursSpread * 60 * 60 * 1000) / (totalComments + 1);
  const offset = intervalMs * (index + 1);
  const jitterMs = (Math.random() - 0.5) * intervalMs * 0.4;
  return new Date(base.getTime() + offset + jitterMs).toISOString();
}

function merge(batchPath) {
  const basePath = existsSync(EXPANDED_PATH) ? EXPANDED_PATH : ORIGINAL_PATH;
  const threads = JSON.parse(readFileSync(basePath, 'utf-8'));
  const batch = JSON.parse(readFileSync(batchPath, 'utf-8'));

  const threadMap = new Map(threads.map(t => [t.id, t]));
  let addedTotal = 0;

  for (const entry of batch) {
    const thread = threadMap.get(entry.thread_id);
    if (!thread) {
      console.warn(`Thread ${entry.thread_id} not found, skipping`);
      continue;
    }

    const lastComment = thread.comments[thread.comments.length - 1];
    const baseTime = lastComment?.created_at || thread.created_at;

    for (let i = 0; i < entry.new_comments.length; i++) {
      const nc = entry.new_comments[i];
      const ts = staggerTimestamp(baseTime, i, entry.new_comments.length);
      thread.comments.push({
        id: randomUUID(),
        body: nc.body,
        score: 0,
        images: [],
        user_id: deterministicUserId(nc.username),
        parent_id: null,
        thread_id: entry.thread_id,
        created_at: ts,
        updated_at: ts,
        is_accepted: false,
      });
      addedTotal++;
    }
    thread.comment_count = thread.comments.length;
  }

  writeFileSync(EXPANDED_PATH, JSON.stringify(threads, null, 4) + '\n', 'utf-8');
  console.log(`Merged ${addedTotal} new comments across ${batch.length} threads`);
  console.log(`Output: ${EXPANDED_PATH}`);
}

const batchFile = process.argv[2];
if (!batchFile) {
  console.error('Usage: node merge-expanded.mjs <batch-file.json>');
  process.exit(1);
}
merge(batchFile);
