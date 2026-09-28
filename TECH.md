# EduVerse — Tech Stack (Level 2 — Agent-Ready, Free → Scale)

## 1. Philosophy
- Free Start (Now): static + serverless, no visa, 8GB laptop not always on.
- Paid Scale (Later): funded by sponsors/courses.
- **Auth is CLOUD, not local**: Same Supabase Auth Cloud project as EduCo. (`SUPABASE_URL` shared). No local auth DB. Verifies via `supabase.auth.getUser()` on every request — works even when 8GB laptop is off.

## 2. Stack — Free Start (Locked)
- **Frontend**: Astro 4 static (`output: static`) → Cloudflare Pages free (unlimited bandwidth).
- **Auth**: **Supabase Auth Cloud** via same project as EduCo. (`SUPABASE_URL` shared, CLOUD not local). No new auth server.
- **DB**: Supabase Postgres free (500MB) — tables below.
- **Search**: Postgres `tsvector` free (no Vectorize cost in Phase 0).
- **Storage**: Supabase Storage free (1GB) bucket `lesson-pdfs` or R2 free.

## 3. Architecture
```
[Pages] → Supabase (grades, subjects, lessons, bookmarks) — public reads cached s-maxage=3600
       └─ Auth → EduCo. EduID JWT (supabase.auth.getUser())
       └─ Personal (/bookmarks) → RLS per user, no cache
```

## 4. Supabase SQL (Run in SQL Editor — Agent Must)
```sql
-- Grades
create table if not exists public.grades (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null, -- e.g., 'grade-1-primary'
  name_en text not null,
  name_ar text not null,
  level text not null check (level in ('primary','prep','secondary')),
  sort_order int not null
);

-- Subjects
create table if not exists public.subjects (
  id uuid primary key default gen_random_uuid(),
  grade_id uuid references public.grades(id) on delete cascade,
  slug text not null,
  name_en text not null,
  name_ar text not null,
  unique(grade_id, slug)
);

-- Lessons
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(),
  subject_id uuid references public.subjects(id) on delete cascade,
  slug text unique not null,
  title_en text not null,
  title_ar text not null,
  body text not null, -- markdown/text of lesson
  pdf_url text, -- storage URL or null
  tags text[] default '{}',
  search_vector tsvector, -- for full-text
  created_at timestamptz default now()
);

-- Bookmarks (personal)
create table if not exists public.bookmarks (
  user_id uuid references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, lesson_id)
);

-- Sponsors & Courses (Phase 0: empty, but created)
create table if not exists public.sponsors (
  id uuid primary key default gen_random_uuid(),
  slot text not null, image_url text, href text, active bool default false
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references auth.users(id),
  title text, price numeric, status text default 'draft' check (status in ('draft','review','published'))
);

-- Search index trigger
create or replace function public.lessons_search_trigger() returns trigger as $$
begin
  new.search_vector := to_tsvector('simple', coalesce(new.title_en,'') || ' ' || coalesce(new.title_ar,'') || ' ' || coalesce(new.body,'') || ' ' || array_to_string(new.tags,' '));
  return new;
end; $$ language plpgsql;
drop trigger if exists trg_lessons_search on public.lessons;
create trigger trg_lessons_search before insert or update on public.lessons
  for each row execute function public.lessons_search_trigger();

-- RLS
alter table public.grades enable row level security;
alter table public.subjects enable row level security;
alter table public.lessons enable row level security;
alter table public.bookmarks enable row level security;
alter table public.sponsors enable row level security;
alter table public.courses enable row level security;

-- Public read for catalog, personal for bookmarks
drop policy if exists "grades_public_read" on public.grades;
create policy "grades_public_read" on public.grades for select using (true);
drop policy if exists "subjects_public_read" on public.subjects;
create policy "subjects_public_read" on public.subjects for select using (true);
drop policy if exists "lessons_public_read" on public.lessons;
create policy "lessons_public_read" on public.lessons for select using (true);
drop policy if exists "bookmarks_own" on public.bookmarks;
create policy "bookmarks_own_select" on public.bookmarks for select using (auth.uid() = user_id);
create policy "bookmarks_own_ins" on public.bookmarks for insert with check (auth.uid() = user_id);
create policy "bookmarks_own_del" on public.bookmarks for delete using (auth.uid() = user_id);
drop policy if exists "sponsors_public_read" on public.sponsors;
create policy "sponsors_public_read" on public.sponsors for select using (true);
-- courses: public can read published only, owners can manage own
drop policy if exists "courses_published_read" on public.courses;
create policy "courses_published_read" on public.courses for select using (status='published' or auth.uid()=creator_id);

-- Storage bucket (run via dashboard or SQL)
insert into storage.buckets (id, name, public) values ('lesson-pdfs','lesson-pdfs', true)
on conflict (id) do nothing;
```

### Verification (Agent)
```sql
select count(*) from public.grades; -- should be ≥1 after seed
select * from public.lessons where search_vector @@ plainto_tsquery('simple','رياضيات');
-- bookmarks as anon → 0 rows
```

## 5. Search Contract (Phase 0)
```ts
// /api/search not needed — query directly:
const q = searchParams.get('q') || '';
const { data } = await supabase
  .from('lessons')
  .select('id,slug,title_en,title_ar')
  .textSearch('search_vector', q, { type:'plain', config:'simple' })
  .limit(20);
```

## 6. Bookmarks Contract
```ts
// add
await supabase.from('bookmarks').insert({ user_id: user.id, lesson_id });
// list
await supabase.from('bookmarks').select('lesson:lessons(slug,title_en)').eq('user_id', user.id);
```

## 7. Env (Same as EduCo.)
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
SITE_URL=https://eduverse-eg.pages.dev
```

## 8. Scaling Path to 1M/sec (Documented)
- Phase 1: add Vectorize for semantic search, R2 for assets.
- Phase 2: edge SSR via Workers, CDN purge on lesson publish.

## 9. Limits & Dev
- Pages 25MB/asset, Supabase 500MB. Static build ~400MB RAM on 8GB laptop. No always-on.

## 10. Commands
```bash
npm run dev
npm run build
wrangler pages deploy dist
```

## 11. Non-Goals
- No LLM inference (→ Chat), no Islamic corpus (→ Rafiq), no local harness (→ Agent).
