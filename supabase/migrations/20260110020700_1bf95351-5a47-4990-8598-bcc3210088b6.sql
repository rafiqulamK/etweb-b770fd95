-- Fix security: protect user emails and demo credentials

-- 1) Profiles: ensure RLS is enabled and only owners can read/write
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- 2) Demo credentials: move sensitive access fields out of public demo_projects
CREATE TABLE IF NOT EXISTS public.demo_project_credentials (
  project_id UUID PRIMARY KEY,
  access_username TEXT,
  access_password TEXT,
  access_code TEXT,
  access_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.demo_project_credentials ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read demo credentials" ON public.demo_project_credentials;
DROP POLICY IF EXISTS "Admins can write demo credentials" ON public.demo_project_credentials;

CREATE POLICY "Admins can read demo credentials"
ON public.demo_project_credentials
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can write demo credentials"
ON public.demo_project_credentials
FOR ALL
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- Keep updated_at in sync
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $fn$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$fn$ LANGUAGE plpgsql SET search_path = public;

DROP TRIGGER IF EXISTS set_demo_project_credentials_updated_at ON public.demo_project_credentials;
CREATE TRIGGER set_demo_project_credentials_updated_at
BEFORE UPDATE ON public.demo_project_credentials
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Migrate existing data if the legacy columns still exist
DO $do$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='demo_projects' AND column_name='access_username') THEN
    INSERT INTO public.demo_project_credentials (project_id, access_username, access_password, access_code, access_notes)
    SELECT id, access_username, access_password, access_code, access_notes
    FROM public.demo_projects
    WHERE access_username IS NOT NULL
       OR access_password IS NOT NULL
       OR access_code IS NOT NULL
       OR access_notes IS NOT NULL
    ON CONFLICT (project_id) DO UPDATE
      SET access_username = EXCLUDED.access_username,
          access_password = EXCLUDED.access_password,
          access_code = EXCLUDED.access_code,
          access_notes = EXCLUDED.access_notes;

    ALTER TABLE public.demo_projects
      DROP COLUMN IF EXISTS access_username,
      DROP COLUMN IF EXISTS access_password,
      DROP COLUMN IF EXISTS access_code,
      DROP COLUMN IF EXISTS access_notes;
  END IF;
END
$do$;
