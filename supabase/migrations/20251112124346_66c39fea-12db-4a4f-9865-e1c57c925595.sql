-- Create distributor_stock table
CREATE TABLE IF NOT EXISTS public.distributor_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  distributor_name TEXT NOT NULL,
  distributor_code TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_code TEXT NOT NULL,
  case_size INTEGER NOT NULL DEFAULT 0,
  quantity_cases INTEGER NOT NULL DEFAULT 0,
  quantity_pcs INTEGER NOT NULL DEFAULT 0,
  stock_value NUMERIC NOT NULL DEFAULT 0,
  batch TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.distributor_stock ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Admins and sales can view distributor stock"
ON public.distributor_stock
FOR SELECT
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

CREATE POLICY "Admins and sales can manage distributor stock"
ON public.distributor_stock
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role) OR 
  has_role(auth.uid(), 'sales'::app_role)
);

-- Create trigger for updated_at
CREATE TRIGGER update_distributor_stock_updated_at
BEFORE UPDATE ON public.distributor_stock
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();