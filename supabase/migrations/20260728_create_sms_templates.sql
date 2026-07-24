-- Create SMS templates table
CREATE TABLE IF NOT EXISTS public.sms_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key TEXT UNIQUE NOT NULL,
  template_text TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default SMS templates
INSERT INTO public.sms_templates (template_key, template_text) VALUES
  ('ORDER_CONFIRMATION', 'Hi {customerName}! Your order #{orderId} has been confirmed. Total: ৳{amount}. Thank you for shopping with Beauty Dokan BD!'),
  ('PAYMENT_SUCCESS', 'Payment received! Your order #{orderId} (৳{amount}) will be processed shortly. Tracking info coming soon!'),
  ('SHIPMENT', 'Great news! Your order #{orderId} has shipped. Track it here: {trackingUrl}'),
  ('DELIVERY', 'Your order #{orderId} is out for delivery today. Please keep your phone available!');

-- Enable RLS
ALTER TABLE public.sms_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Everyone can read templates
CREATE POLICY "Anyone can read SMS templates"
  ON public.sms_templates
  FOR SELECT
  USING (true);

-- RLS Policy: Only admins can modify templates
CREATE POLICY "Admins can modify SMS templates"
  ON public.sms_templates
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
