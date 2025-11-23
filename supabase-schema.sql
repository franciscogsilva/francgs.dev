-- Tabla de reacciones
create table if not exists reactions (
  id bigint primary key generated always as identity,
  article_id text not null,
  reaction_type text not null,
  count int default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(article_id, reaction_type)
);

-- Tabla de logs para rate limiting
create table if not exists reaction_logs (
  id bigint primary key generated always as identity,
  article_id text not null,
  reaction_type text not null,
  ip_hash text not null,
  created_at timestamp with time zone default now()
);

-- Índices para performance
create index if not exists idx_reactions_article on reactions(article_id);
create index if not exists idx_logs_ip_time on reaction_logs(ip_hash, created_at);
create index if not exists idx_logs_article_type_ip on reaction_logs(article_id, reaction_type, ip_hash);

-- Función para incrementar reacciones
create or replace function increment_reaction(p_article_id text, p_reaction_type text)
returns void as $$
begin
  update reactions
  set count = count + 1,
      updated_at = now()
  where article_id = p_article_id
    and reaction_type = p_reaction_type;
end;
$$ language plpgsql;

-- Row Level Security (RLS)
alter table reactions enable row level security;
alter table reaction_logs enable row level security;

-- Política: Todos pueden leer reacciones
create policy "Anyone can read reactions"
  on reactions for select
  using (true);

-- Política: Solo el servidor puede escribir (usando service_role key)
create policy "Service role can insert reactions"
  on reactions for insert
  with check (true);

create policy "Service role can update reactions"
  on reactions for update
  using (true);

-- Política: Solo el servidor puede escribir logs
create policy "Service role can insert logs"
  on reaction_logs for insert
  with check (true);

-- Limpiar logs antiguos (más de 24 horas)
create or replace function cleanup_old_logs()
returns void as $$
begin
  delete from reaction_logs
  where created_at < now() - interval '24 hours';
end;
$$ language plpgsql;
