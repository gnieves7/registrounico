create unique index if not exists telegram_link_tokens_token_unique_idx
on public.telegram_link_tokens (token);

create unique index if not exists telegram_contacts_active_user_unique_idx
on public.telegram_contacts (user_id)
where is_active;

create unique index if not exists telegram_contacts_active_chat_unique_idx
on public.telegram_contacts (chat_id)
where is_active;

alter table public.telegram_contacts
  drop constraint if exists telegram_contacts_private_chat_only;

alter table public.telegram_contacts
  add constraint telegram_contacts_private_chat_only
  check (chat_type = 'private');