#!/usr/bin/env node
/**
 * Import expanded forum comments into Supabase.
 *
 * Usage:
 *   node import-comments.mjs --dry-run          # preview without inserting
 *   node import-comments.mjs                     # live insert
 *
 * Env vars (or auto-read from wrangler.toml + .dev.vars):
 *   SUPABASE_URL, SUPABASE_JWT_SECRET
 */
import { readFileSync, existsSync } from 'fs';
import { createHmac } from 'crypto';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ORIGINAL_PATH = join(__dirname, 'forum-threads-export.json');
const EXPANDED_PATH = join(__dirname, 'forum-threads-expanded.json');
const BATCH_SIZE = 20;
const DELAY_MS = 200;

const dryRun = process.argv.includes('--dry-run');

function base64url(input) {
  const str = typeof input === 'string' ? input : input.toString('base64');
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function makeServiceJwt(secret) {
  const header = base64url(Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })));
  const now = Math.floor(Date.now() / 1000);
  const payload = base64url(Buffer.from(JSON.stringify({
    role: 'service_role',
    iss: 'supabase',
    iat: now,
    exp: now + 3600,
  })));
  const sig = base64url(createHmac('sha256', secret).update(`${header}.${payload}`).digest('base64'));
  return `${header}.${payload}.${sig}`;
}

function loadConfig() {
  let supabaseUrl = process.env.SUPABASE_URL;
  let anonKey = process.env.SUPABASE_ANON_KEY;
  let jwtSecret = process.env.SUPABASE_JWT_SECRET;

  const toml = readFileSync(join(__dirname, 'wrangler.toml'), 'utf-8');

  if (!supabaseUrl) {
    const match = toml.match(/SUPABASE_URL\s*=\s*"([^"]+)"/);
    if (match) supabaseUrl = match[1];
  }

  if (!anonKey) {
    const match = toml.match(/SUPABASE_ANON_KEY\s*=\s*"([^"]+)"/);
    if (match) anonKey = match[1];
  }

  if (!jwtSecret) {
    const devVarsPath = join(__dirname, '.dev.vars');
    if (existsSync(devVarsPath)) {
      const vars = readFileSync(devVarsPath, 'utf-8');
      const match = vars.match(/SUPABASE_JWT_SECRET=(.+)/);
      if (match) jwtSecret = match[1].trim();
    }
  }

  if (!supabaseUrl || !anonKey || !jwtSecret) {
    console.error('Missing SUPABASE_URL, SUPABASE_ANON_KEY, or SUPABASE_JWT_SECRET');
    console.error('Set as env vars or ensure wrangler.toml + .dev.vars exist');
    process.exit(1);
  }

  return { supabaseUrl: supabaseUrl.replace(/\/+$/, ''), anonKey, jwtSecret };
}

function diffComments(original, expanded) {
  const origIds = new Set();
  for (const t of original) {
    for (const c of t.comments) origIds.add(c.id);
  }

  const newComments = [];
  for (const t of expanded) {
    for (const c of t.comments) {
      if (!origIds.has(c.id)) {
        newComments.push(c);
      }
    }
  }
  return newComments;
}

async function insertBatch(comments, supabaseUrl, anonKey, jwt) {
  const url = `${supabaseUrl}/rest/v1/comments`;
  const rows = comments.map(c => ({
    id: c.id,
    thread_id: c.thread_id,
    body: c.body,
    score: c.score ?? 0,
    images: c.images ?? [],
    user_id: c.user_id,
    parent_id: c.parent_id ?? null,
    created_at: c.created_at,
    updated_at: c.updated_at,
    is_accepted: c.is_accepted ?? false,
  }));

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': anonKey,
      'Authorization': `Bearer ${jwt}`,
      'Prefer': 'resolution=ignore-duplicates',
    },
    body: JSON.stringify(rows),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Insert failed (${res.status}): ${body}`);
  }
  return rows.length;
}

async function updateCommentCounts(expanded, supabaseUrl, anonKey, jwt) {
  let updated = 0;
  for (const t of expanded) {
    const url = `${supabaseUrl}/rest/v1/threads?id=eq.${t.id}`;
    const res = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'apikey': anonKey,
        'Authorization': `Bearer ${jwt}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({ comment_count: t.comments.length }),
    });
    if (!res.ok) {
      console.warn(`  Failed to update comment_count for thread ${t.id}: ${res.status}`);
    } else {
      updated++;
    }
    await sleep(50);
  }
  return updated;
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const { supabaseUrl, anonKey, jwtSecret } = loadConfig();
  const jwt = makeServiceJwt(jwtSecret);

  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
  console.log(`Supabase: ${supabaseUrl}`);

  const original = JSON.parse(readFileSync(ORIGINAL_PATH, 'utf-8'));
  const expanded = JSON.parse(readFileSync(EXPANDED_PATH, 'utf-8'));

  const newComments = diffComments(original, expanded);
  console.log(`\nNew comments to insert: ${newComments.length}`);

  const threadIds = new Set(newComments.map(c => c.thread_id));
  console.log(`Threads affected: ${threadIds.size}`);

  if (dryRun) {
    console.log('\n--- DRY RUN PREVIEW ---');
    const byThread = {};
    for (const c of newComments) {
      byThread[c.thread_id] = (byThread[c.thread_id] || 0) + 1;
    }
    for (const t of expanded) {
      if (byThread[t.id]) {
        console.log(`  ${t.title.slice(0, 70).padEnd(72)} +${byThread[t.id]} comments`);
      }
    }
    console.log(`\nTotal: ${newComments.length} comments across ${threadIds.size} threads`);
    console.log('No changes made. Remove --dry-run to insert.');
    return;
  }

  console.log('\nInserting comments...');
  let inserted = 0;
  for (let i = 0; i < newComments.length; i += BATCH_SIZE) {
    const batch = newComments.slice(i, i + BATCH_SIZE);
    const count = await insertBatch(batch, supabaseUrl, anonKey, jwt);
    inserted += count;
    process.stdout.write(`  ${inserted}/${newComments.length}\r`);
    await sleep(DELAY_MS);
  }
  console.log(`\nInserted ${inserted} comments.`);

  console.log('\nUpdating comment counts on threads...');
  const threadsToUpdate = expanded.filter(t => threadIds.has(t.id));
  const updated = await updateCommentCounts(threadsToUpdate, supabaseUrl, anonKey, jwt);
  console.log(`Updated ${updated}/${threadsToUpdate.length} thread comment counts.`);

  console.log('\nDone.');
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
