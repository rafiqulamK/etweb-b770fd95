-- Add new columns to demo_projects for preview functionality
ALTER TABLE public.demo_projects 
ADD COLUMN IF NOT EXISTS preview_mode text DEFAULT 'screenshot',
ADD COLUMN IF NOT EXISTS allow_interaction boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS view_count integer DEFAULT 0;

-- Create consultation_requests table
CREATE TABLE IF NOT EXISTS public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  interested_project text,
  message text,
  source text DEFAULT 'popup',
  created_at timestamp with time zone DEFAULT now(),
  is_read boolean DEFAULT false
);

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit consultation request"
ON public.consultation_requests FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view consultation requests"
ON public.consultation_requests FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update consultation requests"
ON public.consultation_requests FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete consultation requests"
ON public.consultation_requests FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create visitor_analytics table
CREATE TABLE IF NOT EXISTS public.visitor_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  page_path text NOT NULL,
  device_type text DEFAULT 'desktop',
  scroll_depth integer DEFAULT 0,
  time_on_page integer DEFAULT 0,
  click_count integer DEFAULT 0,
  referrer text,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.visitor_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics"
ON public.visitor_analytics FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view analytics"
ON public.visitor_analytics FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create interaction_events table
CREATE TABLE IF NOT EXISTS public.interaction_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  event_type text NOT NULL,
  element_id text,
  element_type text,
  x_position integer,
  y_position integer,
  page_path text NOT NULL,
  project_id uuid REFERENCES public.demo_projects(id) ON DELETE SET NULL,
  metadata jsonb,
  created_at timestamp with time zone DEFAULT now()
);

ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert interaction events"
ON public.interaction_events FOR INSERT
WITH CHECK (true);

CREATE POLICY "Admins can view interaction events"
ON public.interaction_events FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));