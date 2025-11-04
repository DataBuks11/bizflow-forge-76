-- ============================================
-- SECURITY FIX PART 1: Schema Changes
-- ============================================

-- Add user_id to employees table to link with auth.users
ALTER TABLE public.employees ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE UNIQUE INDEX idx_employees_user_id ON public.employees(user_id) WHERE user_id IS NOT NULL;

-- Extend app_role enum with additional roles
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'hr' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'hr';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'sales' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'sales';
  END IF;
END $$;

DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'finance' AND enumtypid = 'public.app_role'::regtype) THEN
    ALTER TYPE public.app_role ADD VALUE 'finance';
  END IF;
END $$;

-- Create helper function to get employee ID for current user
CREATE OR REPLACE FUNCTION public.get_employee_id_for_user(_user_id UUID)
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.employees WHERE user_id = _user_id LIMIT 1;
$$;