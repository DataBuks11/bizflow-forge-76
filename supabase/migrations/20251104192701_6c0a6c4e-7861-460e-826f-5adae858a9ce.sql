-- ============================================
-- SECURITY FIX PART 2: Replace Overly Permissive Policies
-- ============================================

-- Drop all old policies that use USING (true)

-- Employees
DROP POLICY IF EXISTS "Authenticated users can view employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can insert employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can update employees" ON public.employees;
DROP POLICY IF EXISTS "Authenticated users can delete employees" ON public.employees;

-- Attendance
DROP POLICY IF EXISTS "Authenticated users can view attendance" ON public.attendance;
DROP POLICY IF EXISTS "Authenticated users can insert attendance" ON public.attendance;
DROP POLICY IF EXISTS "Authenticated users can update attendance" ON public.attendance;

-- Leave Requests
DROP POLICY IF EXISTS "Authenticated users can view leave_requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Authenticated users can insert leave_requests" ON public.leave_requests;
DROP POLICY IF EXISTS "Authenticated users can update leave_requests" ON public.leave_requests;

-- Payroll
DROP POLICY IF EXISTS "Authenticated users can view payroll" ON public.payroll;
DROP POLICY IF EXISTS "Authenticated users can insert payroll" ON public.payroll;
DROP POLICY IF EXISTS "Authenticated users can update payroll" ON public.payroll;

-- Expenses
DROP POLICY IF EXISTS "Authenticated users can view expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can insert expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can update expenses" ON public.expenses;
DROP POLICY IF EXISTS "Authenticated users can delete expenses" ON public.expenses;

-- Customers
DROP POLICY IF EXISTS "Authenticated users can view customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can insert customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can update customers" ON public.customers;
DROP POLICY IF EXISTS "Authenticated users can delete customers" ON public.customers;

-- Distributors
DROP POLICY IF EXISTS "Authenticated users can view distributors" ON public.distributors;
DROP POLICY IF EXISTS "Authenticated users can insert distributors" ON public.distributors;
DROP POLICY IF EXISTS "Authenticated users can update distributors" ON public.distributors;
DROP POLICY IF EXISTS "Authenticated users can delete distributors" ON public.distributors;

-- Products
DROP POLICY IF EXISTS "Authenticated users can view products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can insert products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can update products" ON public.products;
DROP POLICY IF EXISTS "Authenticated users can delete products" ON public.products;

-- Leads
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can update leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can delete leads" ON public.leads;

-- Quotations
DROP POLICY IF EXISTS "Authenticated users can view quotations" ON public.quotations;
DROP POLICY IF EXISTS "Authenticated users can insert quotations" ON public.quotations;
DROP POLICY IF EXISTS "Authenticated users can update quotations" ON public.quotations;
DROP POLICY IF EXISTS "Authenticated users can delete quotations" ON public.quotations;

-- Sales Orders
DROP POLICY IF EXISTS "Authenticated users can view sales_orders" ON public.sales_orders;
DROP POLICY IF EXISTS "Authenticated users can insert sales_orders" ON public.sales_orders;
DROP POLICY IF EXISTS "Authenticated users can update sales_orders" ON public.sales_orders;
DROP POLICY IF EXISTS "Authenticated users can delete sales_orders" ON public.sales_orders;

-- Invoices
DROP POLICY IF EXISTS "Authenticated users can view invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can insert invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can update invoices" ON public.invoices;
DROP POLICY IF EXISTS "Authenticated users can delete invoices" ON public.invoices;

-- Sales Targets
DROP POLICY IF EXISTS "Authenticated users can view sales_targets" ON public.sales_targets;
DROP POLICY IF EXISTS "Authenticated users can insert sales_targets" ON public.sales_targets;
DROP POLICY IF EXISTS "Authenticated users can update sales_targets" ON public.sales_targets;
DROP POLICY IF EXISTS "Authenticated users can delete sales_targets" ON public.sales_targets;

-- Location Tracking
DROP POLICY IF EXISTS "Authenticated users can view location_tracking" ON public.location_tracking;
DROP POLICY IF EXISTS "Authenticated users can insert location_tracking" ON public.location_tracking;
DROP POLICY IF EXISTS "Authenticated users can update location_tracking" ON public.location_tracking;
DROP POLICY IF EXISTS "Authenticated users can delete location_tracking" ON public.location_tracking;

-- ============================================
-- Create New Role-Based Policies
-- ============================================

-- EMPLOYEES TABLE
CREATE POLICY "Admins and HR can view all employees" ON public.employees
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

CREATE POLICY "Employees can view their own record" ON public.employees
FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE POLICY "Admins and HR can manage employees" ON public.employees
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

-- ATTENDANCE TABLE
CREATE POLICY "Admins and HR can view all attendance" ON public.attendance
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

CREATE POLICY "Employees can view own attendance" ON public.attendance
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Employees can insert own attendance" ON public.attendance
FOR INSERT TO authenticated WITH CHECK (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and HR can manage attendance" ON public.attendance
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

-- LEAVE REQUESTS TABLE
CREATE POLICY "Admins and HR can view all leave requests" ON public.leave_requests
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

CREATE POLICY "Employees can view own leave requests" ON public.leave_requests
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Employees can create own leave requests" ON public.leave_requests
FOR INSERT TO authenticated WITH CHECK (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and HR can manage leave requests" ON public.leave_requests
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

-- PAYROLL TABLE
CREATE POLICY "Admins and finance can view all payroll" ON public.payroll
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

CREATE POLICY "Employees can view own payroll" ON public.payroll
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and finance can manage payroll" ON public.payroll
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

-- EXPENSES TABLE
CREATE POLICY "Admins and finance can view all expenses" ON public.expenses
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

CREATE POLICY "Employees can view own expenses" ON public.expenses
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Employees can create own expenses" ON public.expenses
FOR INSERT TO authenticated WITH CHECK (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Employees can update own expenses" ON public.expenses
FOR UPDATE TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and finance can manage expenses" ON public.expenses
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

-- CUSTOMERS TABLE
CREATE POLICY "Admins and sales can view customers" ON public.customers
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Admins and sales can manage customers" ON public.customers
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- DISTRIBUTORS TABLE
CREATE POLICY "Admins and sales can view distributors" ON public.distributors
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Admins and sales can manage distributors" ON public.distributors
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- PRODUCTS TABLE
CREATE POLICY "All authenticated users can view products" ON public.products
FOR SELECT TO authenticated USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage products" ON public.products
FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- LEADS TABLE
CREATE POLICY "Admins and sales can view leads" ON public.leads
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Admins and sales can manage leads" ON public.leads
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- QUOTATIONS TABLE
CREATE POLICY "Admins and sales can view quotations" ON public.quotations
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Admins and sales can manage quotations" ON public.quotations
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- SALES ORDERS TABLE
CREATE POLICY "Admins and sales can view sales orders" ON public.sales_orders
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Admins and sales can manage sales orders" ON public.sales_orders
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- INVOICES TABLE
CREATE POLICY "Admins and finance can view invoices" ON public.invoices
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

CREATE POLICY "Admins and finance can manage invoices" ON public.invoices
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'finance')
);

-- SALES TARGETS TABLE
CREATE POLICY "Admins and sales can view all sales targets" ON public.sales_targets
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

CREATE POLICY "Employees can view own sales targets" ON public.sales_targets
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and sales can manage sales targets" ON public.sales_targets
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'sales')
);

-- LOCATION TRACKING TABLE
CREATE POLICY "Admins and HR can view all location tracking" ON public.location_tracking
FOR SELECT TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);

CREATE POLICY "Employees can view own location tracking" ON public.location_tracking
FOR SELECT TO authenticated USING (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Employees can insert own location tracking" ON public.location_tracking
FOR INSERT TO authenticated WITH CHECK (
  employee_id = get_employee_id_for_user(auth.uid())
);

CREATE POLICY "Admins and HR can manage location tracking" ON public.location_tracking
FOR ALL TO authenticated USING (
  has_role(auth.uid(), 'admin') OR has_role(auth.uid(), 'hr')
);