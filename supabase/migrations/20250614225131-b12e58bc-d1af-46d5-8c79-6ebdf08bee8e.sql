
-- 1. Create a function to assign 'user' role on signup
CREATE OR REPLACE FUNCTION public.handle_new_signup_userrole()
RETURNS TRIGGER AS $$
BEGIN
  -- Only insert role if not already present
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = NEW.id AND role = 'user'
  ) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 2. Trigger: after each new user signup in auth.users
DROP TRIGGER IF EXISTS on_auth_user_created_userrole ON auth.users;
CREATE TRIGGER on_auth_user_created_userrole
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE PROCEDURE public.handle_new_signup_userrole();

