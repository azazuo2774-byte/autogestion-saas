-- AutoGestion SaaS: exactamente una tabla para validar la beta (FN0)
-- Ejecutar una sola vez en Supabase > SQL Editor.
-- Advertencia: si se usa anon key en frontend, no conceder SELECT público.
create table if not exists public.inscritos_beta (
 id uuid primary key default gen_random_uuid(),
 nombre text not null check (char_length(trim(nombre)) between 3 and 100),
 correo text not null unique check (char_length(correo) between 5 and 200 and position('@' in correo)>1),
 perfil_empresa text not null check (char_length(trim(perfil_empresa)) between 3 and 120),
 necesidad text not null check (char_length(trim(necesidad)) between 10 and 500),
 interes text not null check (interes in ('Muy interesado','Interesado','Deseo conocer más')),
 consentimiento boolean not null check (consentimiento = true),
 origen text not null default 'landing-vercel' check (origen = 'landing-vercel'),
 fecha_inscripcion timestamptz not null default now()
);
alter table public.inscritos_beta enable row level security;
revoke all on table public.inscritos_beta from anon, authenticated;
grant insert on table public.inscritos_beta to anon;
drop policy if exists "Inscripcion beta publica controlada" on public.inscritos_beta;
create policy "Inscripcion beta publica controlada" on public.inscritos_beta
 for insert to anon with check (
 consentimiento = true and
 char_length(trim(nombre)) between 3 and 100 and
 char_length(trim(necesidad)) between 10 and 500 and
 origen = 'landing-vercel'
 );
-- No se define policy SELECT para anon: otras personas no podrán leer registros.
-- Consultar filas únicamente desde panel privado con permisos administrativos.
-- En caso de difusión amplia, incorporar CAPTCHA/rate limiting en un endpoint de servidor.
