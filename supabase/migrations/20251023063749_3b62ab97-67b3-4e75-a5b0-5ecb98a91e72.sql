-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  min_stock INTEGER NOT NULL DEFAULT 0,
  location TEXT,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create leads table
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'New',
  value NUMERIC NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create quotations table
CREATE TABLE public.quotations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  items INTEGER NOT NULL DEFAULT 0,
  valid_until DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales_orders table
CREATE TABLE public.sales_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer TEXT NOT NULL,
  quotation_ref TEXT,
  amount NUMERIC NOT NULL,
  items INTEGER NOT NULL DEFAULT 0,
  delivery_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create sales_targets table
CREATE TABLE public.sales_targets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  role TEXT NOT NULL,
  target NUMERIC NOT NULL,
  achieved NUMERIC NOT NULL DEFAULT 0,
  percentage INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create location_tracking table
CREATE TABLE public.location_tracking (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create invoices table
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer TEXT NOT NULL,
  order_id TEXT,
  amount NUMERIC NOT NULL,
  tax NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  total NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create expenses table
CREATE TABLE public.expenses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  category TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.location_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for products
CREATE POLICY "Authenticated users can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert products" ON public.products FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update products" ON public.products FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete products" ON public.products FOR DELETE USING (true);

-- Create RLS policies for leads
CREATE POLICY "Authenticated users can view leads" ON public.leads FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update leads" ON public.leads FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete leads" ON public.leads FOR DELETE USING (true);

-- Create RLS policies for quotations
CREATE POLICY "Authenticated users can view quotations" ON public.quotations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert quotations" ON public.quotations FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update quotations" ON public.quotations FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete quotations" ON public.quotations FOR DELETE USING (true);

-- Create RLS policies for sales_orders
CREATE POLICY "Authenticated users can view sales_orders" ON public.sales_orders FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert sales_orders" ON public.sales_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales_orders" ON public.sales_orders FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete sales_orders" ON public.sales_orders FOR DELETE USING (true);

-- Create RLS policies for sales_targets
CREATE POLICY "Authenticated users can view sales_targets" ON public.sales_targets FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert sales_targets" ON public.sales_targets FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update sales_targets" ON public.sales_targets FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete sales_targets" ON public.sales_targets FOR DELETE USING (true);

-- Create RLS policies for location_tracking
CREATE POLICY "Authenticated users can view location_tracking" ON public.location_tracking FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert location_tracking" ON public.location_tracking FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update location_tracking" ON public.location_tracking FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete location_tracking" ON public.location_tracking FOR DELETE USING (true);

-- Create RLS policies for invoices
CREATE POLICY "Authenticated users can view invoices" ON public.invoices FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert invoices" ON public.invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update invoices" ON public.invoices FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete invoices" ON public.invoices FOR DELETE USING (true);

-- Create RLS policies for expenses
CREATE POLICY "Authenticated users can view expenses" ON public.expenses FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert expenses" ON public.expenses FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated users can update expenses" ON public.expenses FOR UPDATE USING (true);
CREATE POLICY "Authenticated users can delete expenses" ON public.expenses FOR DELETE USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_leads_updated_at BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON public.quotations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sales_orders_updated_at BEFORE UPDATE ON public.sales_orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_sales_targets_updated_at BEFORE UPDATE ON public.sales_targets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_location_tracking_updated_at BEFORE UPDATE ON public.location_tracking FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON public.expenses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();