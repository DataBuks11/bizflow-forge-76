-- Create retailers table
CREATE TABLE public.retailers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  gstin TEXT,
  distributor_id UUID,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create audit_logs table
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  module TEXT NOT NULL,
  description TEXT,
  ip_address TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create vehicles table
CREATE TABLE public.vehicles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  vehicle_number TEXT NOT NULL UNIQUE,
  vehicle_type TEXT NOT NULL,
  model TEXT,
  driver_name TEXT,
  driver_phone TEXT,
  capacity NUMERIC,
  status TEXT NOT NULL DEFAULT 'Active',
  last_service_date DATE,
  next_service_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_modules table
CREATE TABLE public.project_modules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  module_name TEXT NOT NULL,
  module_code TEXT NOT NULL UNIQUE,
  description TEXT,
  version TEXT DEFAULT '1.0.0',
  status TEXT NOT NULL DEFAULT 'Active',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_name TEXT NOT NULL,
  project_code TEXT NOT NULL UNIQUE,
  description TEXT,
  start_date DATE,
  end_date DATE,
  budget NUMERIC,
  manager_id UUID,
  status TEXT NOT NULL DEFAULT 'Planning',
  progress INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create report_schedules table
CREATE TABLE public.report_schedules (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  frequency TEXT NOT NULL,
  recipients TEXT[],
  next_run_date TIMESTAMP WITH TIME ZONE,
  last_run_date TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_name TEXT NOT NULL,
  campaign_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  budget NUMERIC,
  target_audience TEXT,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create survey_feedback table
CREATE TABLE public.survey_feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  survey_name TEXT NOT NULL,
  respondent_name TEXT,
  respondent_email TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  category TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create super_distributor_stock table
CREATE TABLE public.super_distributor_stock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  super_distributor_name TEXT NOT NULL,
  super_distributor_code TEXT NOT NULL,
  item_name TEXT NOT NULL,
  item_code TEXT NOT NULL,
  category TEXT NOT NULL,
  brand TEXT NOT NULL,
  quantity_cases INTEGER NOT NULL DEFAULT 0,
  quantity_pcs INTEGER NOT NULL DEFAULT 0,
  case_size INTEGER NOT NULL DEFAULT 0,
  stock_value NUMERIC NOT NULL DEFAULT 0,
  batch TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.retailers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.super_distributor_stock ENABLE ROW LEVEL SECURITY;

-- RLS Policies for retailers
CREATE POLICY "Admins and sales can view retailers"
  ON public.retailers FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can manage retailers"
  ON public.retailers FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

-- RLS Policies for audit_logs
CREATE POLICY "Admins can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "All authenticated users can insert audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for vehicles
CREATE POLICY "Admins can view vehicles"
  ON public.vehicles FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage vehicles"
  ON public.vehicles FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for project_modules
CREATE POLICY "Admins can view project modules"
  ON public.project_modules FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage project modules"
  ON public.project_modules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for projects
CREATE POLICY "Admins can view projects"
  ON public.projects FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage projects"
  ON public.projects FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for report_schedules
CREATE POLICY "Admins can view report schedules"
  ON public.report_schedules FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage report schedules"
  ON public.report_schedules FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies for campaigns
CREATE POLICY "Admins and sales can view campaigns"
  ON public.campaigns FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can manage campaigns"
  ON public.campaigns FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

-- RLS Policies for survey_feedback
CREATE POLICY "All authenticated users can view survey feedback"
  ON public.survey_feedback FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "All authenticated users can submit survey feedback"
  ON public.survey_feedback FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- RLS Policies for super_distributor_stock
CREATE POLICY "Admins and sales can view super distributor stock"
  ON public.super_distributor_stock FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

CREATE POLICY "Admins and sales can manage super distributor stock"
  ON public.super_distributor_stock FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'sales'::app_role));

-- Add triggers for updated_at
CREATE TRIGGER update_retailers_updated_at
  BEFORE UPDATE ON public.retailers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
  BEFORE UPDATE ON public.vehicles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_project_modules_updated_at
  BEFORE UPDATE ON public.project_modules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_report_schedules_updated_at
  BEFORE UPDATE ON public.report_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_super_distributor_stock_updated_at
  BEFORE UPDATE ON public.super_distributor_stock
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();