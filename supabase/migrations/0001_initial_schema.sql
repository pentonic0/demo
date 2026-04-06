-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Admins Table (Custom Auth)
create table public.admins (
  id uuid primary key default uuid_generate_v4(),
  username varchar(255) not null unique,
  password_hash text not null,
  role varchar(50) default 'admin',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Notices Table
create table public.notices (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  date timestamp with time zone not null,
  content text not null,
  author_id uuid references public.admins(id) on delete set null,
  file_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Teachers Table
create table public.teachers (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  designation varchar(255) not null,
  department varchar(255) not null,
  qualification text,
  experience text,
  email varchar(255),
  phone varchar(50),
  image text,
  display_order integer default 0,
  facebook_link text,
  about text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Staff Table
create table public.staff (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  designation varchar(255) not null,
  department varchar(255),
  email varchar(255),
  phone varchar(50),
  image text,
  display_order integer default 0,
  about text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Settings Table (Single Row)
create table public.settings (
  id varchar(50) primary key, -- Will always be 'main'
  school_name varchar(255) default '',
  school_code varchar(100) default '',
  principal_name varchar(255) default '',
  principal_message text default '',
  principal_image text default '',
  chairman_name varchar(255) default '',
  chairman_message text default '',
  chairman_image text default '',
  contact_email varchar(255) default '',
  contact_phone varchar(255) default '',
  address text default '',
  established_year varchar(100) default '',
  location varchar(255) default '',
  google_maps_link text default '',
  facebook_link text default '',
  twitter_link text default '',
  youtube_link text default '',
  instagram_link text default '',
  linkedin_link text default '',
  school_logo text default '',
  maintenance_mode boolean default false,
  show_latest_update boolean default true,
  latest_updates jsonb default '[]'::jsonb,
  show_popup_banner boolean default false,
  popup_banner_image text,
  popup_banner_link text,
  popup_banner_id varchar(255),
  academic_subjects jsonb default '[]'::jsonb,
  academic_routine_url text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Gallery Table
create table public.gallery (
  id uuid primary key default uuid_generate_v4(),
  title varchar(255) not null,
  image_url text not null,
  category varchar(255),
  display_order integer default 0,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Messages Table (Contact Messages from Visitors)
create table public.messages (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  email varchar(255) not null,
  subject varchar(255) not null,
  message text not null,
  is_read boolean default false,
  date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Committee Table
create table public.committee (
  id uuid primary key default uuid_generate_v4(),
  name varchar(255) not null,
  designation varchar(255) not null,
  role varchar(255),
  qualification text,
  experience text,
  email varchar(255),
  phone varchar(50),
  image text,
  display_order integer default 0,
  facebook_link text,
  about text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Academic Information Table
create table public.academic (
  id uuid primary key default uuid_generate_v4(),
  title varchar(255) not null,
  content text,
  file_url text,
  category varchar(100) not null, -- e.g., 'syllabus', 'routine', 'results'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Sliders Table
create table public.sliders (
  id uuid primary key default uuid_generate_v4(),
  title text default '',
  subtitle text default '',
  image_url text not null,
  display_order integer default 0,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert starting setup data
INSERT INTO public.settings (id, maintenance_mode, show_latest_update, latest_updates, show_popup_banner) 
VALUES ('main', false, true, '[]'::jsonb, false) ON CONFLICT (id) DO NOTHING;

-- Policies / RLS
-- Since we are doing a custom auth implementation using Next.js backend, 
-- we will just use the Supabase Anon Key + RLS (for public reads) and Service Role Key (for backend writes),
-- Or we just enable RLS and allow public read access where necessary, and deny all writes (requiring service role token).

ALTER TABLE public.notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.committee ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sliders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on notices" ON public.notices FOR SELECT USING (true);
CREATE POLICY "Allow public read access on teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public read access on staff" ON public.staff FOR SELECT USING (true);
CREATE POLICY "Allow public read access on gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Allow public read access on messages" ON public.messages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on committee" ON public.committee FOR SELECT USING (true);
CREATE POLICY "Allow public read access on academic" ON public.academic FOR SELECT USING (true);
CREATE POLICY "Allow public read access on sliders" ON public.sliders FOR SELECT USING (true);
CREATE POLICY "Allow public read access on settings" ON public.settings FOR SELECT USING (true);

-- No public write access (Only Server/Admin API will do writes using Service Role Key which bypasses RLS)


-- Seed default admin login
INSERT INTO public.admins (username, password_hash, role)
VALUES ('admin', '$2b$10$9ypu/TnQVf1BWbuaViedlOVVTYfGj84VXpyMsGx6XxBm0cKfcJti.', 'admin')
ON CONFLICT (username) DO NOTHING;

CREATE POLICY "Allow public insert on messages" ON public.messages FOR INSERT WITH CHECK (true);
