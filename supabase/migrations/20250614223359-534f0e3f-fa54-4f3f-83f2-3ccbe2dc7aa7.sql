
-- 1. Create an 'app_role' enum for roles (admin, user)
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. User roles table (decoupled from auth.users)
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- 3. Policy function: check if a user is admin
CREATE OR REPLACE FUNCTION public.is_admin(_uid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _uid AND role = 'admin'
  );
$$;

-- 4. Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 5. Allow each user to view their own user_roles
CREATE POLICY "User can view their user_roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- 6. Allow each user to insert their user_roles (for signup/signup extensions)
CREATE POLICY "User can insert their own user_roles"
ON public.user_roles
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. Optionally, to kickstart: add an admin user manually from SQL or mark first reg.
-- (This can be assigned after the first signup.)
