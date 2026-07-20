-- Lock down has_role: only signed-in users may execute it (needed by RLS policies)
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Replace the combined packages SELECT policy so anon never evaluates has_role
DROP POLICY "Anyone views active packages" ON public.packages;

CREATE POLICY "Public views active packages" ON public.packages
  FOR SELECT TO anon
  USING (active = true);

CREATE POLICY "Authenticated views packages" ON public.packages
  FOR SELECT TO authenticated
  USING (active = true OR public.has_role(auth.uid(), 'admin'));