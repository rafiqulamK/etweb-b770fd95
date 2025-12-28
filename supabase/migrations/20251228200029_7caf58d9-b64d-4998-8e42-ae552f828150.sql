-- Create demo_projects table for showcasing apps, websites, and software
CREATE TABLE public.demo_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  project_type TEXT NOT NULL DEFAULT 'website', -- 'app', 'website', 'software'
  demo_url TEXT,
  thumbnail TEXT,
  screenshots TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.demo_projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view published demos"
ON public.demo_projects
FOR SELECT
USING (status = 'published');

CREATE POLICY "Admins can view all demos"
ON public.demo_projects
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can create demos"
ON public.demo_projects
FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update demos"
ON public.demo_projects
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete demos"
ON public.demo_projects
FOR DELETE
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_demo_projects_updated_at
BEFORE UPDATE ON public.demo_projects
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();