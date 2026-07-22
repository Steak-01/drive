-- ===== Roles =====
CREATE TYPE public.app_role AS ENUM ('student', 'admin');

-- ===== Profiles =====
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ===== User roles =====
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ===== has_role (security definer to avoid RLS recursion) =====
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ===== Packages (trip categories — no pricing here; every trip is quoted individually) =====
  CREATE TABLE public.packages (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    code text NOT NULL,
    title text NOT NULL,
    description text,
    sort_order integer NOT NULL DEFAULT 0,
    active boolean NOT NULL DEFAULT true,
    created_at timestamptz NOT NULL DEFAULT now()
  );
  GRANT SELECT ON public.packages TO anon, authenticated;
  GRANT ALL ON public.packages TO service_role;
  ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

  INSERT INTO public.packages (code, title, description, sort_order) VALUES
    ('airport',  'Airport Trips', 'Transfers to and from the airport', 1),
    ('local',    'Local Trips',   'Trips within the local area',       2),
    ('day_trip', '1 Day Trips',   'Single-day out-of-town trips',      3),
    ('vacation', 'Vacations',     'Multi-day vacation transport',      4);

    CREATE TABLE public.vehicle_types (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,        -- e.g. 'private_sedan', '8_seater'
  name text NOT NULL,               -- e.g. 'Private Sedan', '8-Seater Van'
  capacity integer,                 -- number of passengers
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.vehicle_types TO anon, authenticated;
GRANT ALL ON public.vehicle_types TO service_role;
ALTER TABLE public.vehicle_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vehicle_types_select_active"
  ON public.vehicle_types
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

INSERT INTO public.vehicle_types (code, name, capacity, description, sort_order) VALUES
  ('private_sedan', 'Private Sedan', 4, 'Private car for individuals or small groups', 1),
  ('8_seater',      '8-Seater Van',  8, 'Shared or private van for larger groups', 2);

-- ===== Bookings =====
-- status flow: pending_quote -> quoted -> confirmed -> completed (or cancelled at any point)
CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  pickup_location text,
  dropoff_location text,
  trip_date timestamptz,
  passenger_count integer NOT NULL DEFAULT 1,
  amount_cents integer,                              -- NULL until an admin sets the quote
  quoted_at timestamptz,
  quoted_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'pending_quote',
  payment_status text NOT NULL DEFAULT 'unpaid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- ===== updated_at trigger =====
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== Policies: profiles =====
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users insert own profile" ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles
  FOR UPDATE TO authenticated
  USING (auth.uid() = id OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (auth.uid() = id OR public.has_role(auth.uid(), 'admin'));

-- ===== Policies: user_roles =====
CREATE POLICY "Users view own roles" ON public.user_roles
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ===== Policies: packages =====
CREATE POLICY "Anyone views active packages" ON public.packages
  FOR SELECT USING (active = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage packages" ON public.packages
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ===== Policies: bookings =====
-- Students can only create and view their own bookings — updates (quote, status,
-- payment) are admin-only, so a student can never set or alter their own price.
CREATE POLICY "Students view own bookings" ON public.bookings
  FOR SELECT TO authenticated
  USING (auth.uid() = student_id);
CREATE POLICY "Students create own bookings" ON public.bookings
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins manage all bookings" ON public.bookings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));