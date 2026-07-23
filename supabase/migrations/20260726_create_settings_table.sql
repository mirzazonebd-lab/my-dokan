-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_settings_key ON public.settings(setting_key);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read settings
CREATE POLICY "Anyone can read settings"
  ON public.settings
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can insert/update/delete settings
CREATE POLICY "Admins can modify settings"
  ON public.settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
