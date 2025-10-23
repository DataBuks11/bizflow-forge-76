-- Create distributors table
CREATE TABLE public.distributors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  region TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  revenue NUMERIC DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  department TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  check_in TIME,
  check_out TIME,
  status TEXT NOT NULL DEFAULT 'Absent',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create leave_requests table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  leave_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create payroll table
CREATE TABLE public.payroll (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  employee_name TEXT NOT NULL,
  basic_salary NUMERIC NOT NULL,
  allowances NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  net_salary NUMERIC NOT NULL,
  month TEXT NOT NULL,
  year INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.distributors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payroll ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users
CREATE POLICY "Authenticated users can view distributors"
  ON public.distributors FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert distributors"
  ON public.distributors FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update distributors"
  ON public.distributors FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete distributors"
  ON public.distributors FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view customers"
  ON public.customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON public.customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON public.customers FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete customers"
  ON public.customers FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view employees"
  ON public.employees FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert employees"
  ON public.employees FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update employees"
  ON public.employees FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete employees"
  ON public.employees FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view attendance"
  ON public.attendance FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert attendance"
  ON public.attendance FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update attendance"
  ON public.attendance FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view leave_requests"
  ON public.leave_requests FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert leave_requests"
  ON public.leave_requests FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update leave_requests"
  ON public.leave_requests FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can view payroll"
  ON public.payroll FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert payroll"
  ON public.payroll FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update payroll"
  ON public.payroll FOR UPDATE
  TO authenticated
  USING (true);

-- Create triggers for updated_at
CREATE TRIGGER update_distributors_updated_at
  BEFORE UPDATE ON public.distributors
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employees_updated_at
  BEFORE UPDATE ON public.employees
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_attendance_updated_at
  BEFORE UPDATE ON public.attendance
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_leave_requests_updated_at
  BEFORE UPDATE ON public.leave_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_payroll_updated_at
  BEFORE UPDATE ON public.payroll
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();