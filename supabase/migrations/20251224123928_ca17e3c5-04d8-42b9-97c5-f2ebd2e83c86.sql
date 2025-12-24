-- Create branding settings table
CREATE TABLE public.branding_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url TEXT,
  logo_text TEXT DEFAULT 'engineersTech',
  tagline TEXT DEFAULT 'Enterprise Tech Solutions for the Future',
  primary_color TEXT DEFAULT '#90FFA3',
  company_email TEXT DEFAULT 'info@engineerstechbd.com',
  company_phone TEXT DEFAULT '+880 1234-567890',
  company_address TEXT DEFAULT 'Dhaka, Bangladesh',
  facebook_url TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  whatsapp_number TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.branding_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view branding
CREATE POLICY "Anyone can view branding"
  ON public.branding_settings FOR SELECT
  USING (true);

-- Only admins can update branding
CREATE POLICY "Admins can update branding"
  ON public.branding_settings FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert branding"
  ON public.branding_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Insert default branding
INSERT INTO public.branding_settings (
  logo_text, 
  tagline, 
  company_email, 
  company_phone, 
  company_address,
  facebook_url,
  linkedin_url,
  twitter_url,
  whatsapp_number
) VALUES (
  'engineersTech',
  'Enterprise Tech Solutions for the Future',
  'info@engineerstechbd.com',
  '+880 1234-567890',
  'Dhaka, Bangladesh',
  'https://facebook.com/engineerstechbd',
  'https://linkedin.com/company/engineerstechbd',
  'https://twitter.com/engineerstechbd',
  '+8801234567890'
);

-- Add trigger for updated_at
CREATE TRIGGER update_branding_settings_updated_at
  BEFORE UPDATE ON public.branding_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();