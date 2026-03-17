create table public.contact_submissions (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text not null,
  phone         text,
  subject       text not null,
  order_number  text,
  message       text not null,
  ip_address    text,
  user_agent    text,
  created_at    timestamptz not null default now(),
  staff_sent_at timestamptz,
  reply_sent_at timestamptz
);

-- index for admin lookup by email
create index on public.contact_submissions (email);
-- index for date-range queries
create index on public.contact_submissions (created_at desc);
