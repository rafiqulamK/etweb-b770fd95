-- Fix RLS policies with basic input validation
-- These policies allow public inserts but with validation constraints

-- Drop old overly permissive policies
DROP POLICY IF EXISTS "Anyone can submit contact form" ON public.contact_submissions;
DROP POLICY IF EXISTS "Anyone can submit consultation request" ON public.consultation_requests;
DROP POLICY IF EXISTS "Anyone can insert analytics" ON public.visitor_analytics;
DROP POLICY IF EXISTS "Anyone can insert interaction events" ON public.interaction_events;

-- Create new policies with input validation
-- Contact submissions - require minimum data quality
CREATE POLICY "Public can submit contact with validation" 
ON public.contact_submissions 
FOR INSERT 
WITH CHECK (
  length(name) >= 2 AND length(name) <= 100 AND
  length(email) >= 5 AND length(email) <= 255 AND
  email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' AND
  length(message) >= 10 AND length(message) <= 5000
);

-- Consultation requests - require minimum data quality
CREATE POLICY "Public can submit consultation with validation" 
ON public.consultation_requests 
FOR INSERT 
WITH CHECK (
  length(name) >= 2 AND length(name) <= 100 AND
  length(email) >= 5 AND length(email) <= 255 AND
  email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'
);

-- Analytics - allow inserts but require session_id and page_path
CREATE POLICY "Public can track page views" 
ON public.visitor_analytics 
FOR INSERT 
WITH CHECK (
  length(session_id) >= 10 AND
  length(page_path) >= 1 AND length(page_path) <= 500
);

-- Interaction events - allow inserts but require session_id
CREATE POLICY "Public can track interactions" 
ON public.interaction_events 
FOR INSERT 
WITH CHECK (
  length(session_id) >= 10 AND
  length(page_path) >= 1 AND length(page_path) <= 500 AND
  length(event_type) >= 1 AND length(event_type) <= 50
);