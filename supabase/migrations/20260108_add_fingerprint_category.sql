-- Migration: Add fingerprint and category columns for analytics
-- Date: 2026-01-08

BEGIN;

-- Add fingerprint to visitor_analytics for approximate unique visitors tracking
ALTER TABLE IF EXISTS public.visitor_analytics
ADD COLUMN IF NOT EXISTS fingerprint TEXT;

-- Add fingerprint to interaction_events to correlate events to visitors
ALTER TABLE IF EXISTS public.interaction_events
ADD COLUMN IF NOT EXISTS fingerprint TEXT;

-- Add optional category column to interaction_events for categorized reporting
ALTER TABLE IF EXISTS public.interaction_events
ADD COLUMN IF NOT EXISTS category TEXT;

-- Indexes to speed up analytics queries
CREATE INDEX IF NOT EXISTS idx_visitor_analytics_fingerprint ON public.visitor_analytics (fingerprint);
CREATE INDEX IF NOT EXISTS idx_interaction_events_fingerprint ON public.interaction_events (fingerprint);
CREATE INDEX IF NOT EXISTS idx_interaction_events_category ON public.interaction_events (category);

COMMIT;
