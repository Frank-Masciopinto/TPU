-- Admin search indexes for the quotes table.
-- The quotes table was created manually in Supabase (no prior migration file).
-- These indexes support GET /admin/quotes searches by email, quote_number, and phone.
--
-- Note: ilike prefix matching (q%) on email/phone is acceptable at current table volumes (<10k rows).
-- If the table exceeds 100k rows, replace these with lower() functional indexes:
--   create index ... on public.quotes (lower(customer_email));
--   create index ... on public.quotes (lower(customer_phone));

create index if not exists idx_quotes_customer_email
  on public.quotes (customer_email);

create index if not exists idx_quotes_quote_number
  on public.quotes (quote_number);

create index if not exists idx_quotes_customer_phone
  on public.quotes (customer_phone);

create index if not exists idx_quotes_created_at
  on public.quotes (created_at desc);

-- Rollback:
-- drop index if exists idx_quotes_customer_email;
-- drop index if exists idx_quotes_quote_number;
-- drop index if exists idx_quotes_customer_phone;
-- drop index if exists idx_quotes_created_at;
