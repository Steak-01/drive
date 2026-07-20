-- 1. Instructor availability (recurring weekly windows)
CREATE TABLE public.instructor_availability (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  instructor_id uuid NOT NULL,
  day_of_week smallint NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time time NOT NULL,
  end_time time NOT NULL,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (end_time > start_time)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.instructor_availability TO authenticated;
GRANT ALL ON public.instructor_availability TO service_role;

ALTER TABLE public.instructor_availability ENABLE ROW LEVEL SECURITY;

-- Any signed-in user may view availability (needed to book open slots)
CREATE POLICY "Authenticated can view availability"
  ON public.instructor_availability FOR SELECT
  TO authenticated
  USING (true);

-- Instructors manage only their own availability
CREATE POLICY "Instructors manage own availability"
  ON public.instructor_availability FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'instructor') AND instructor_id = auth.uid())
  WITH CHECK (public.has_role(auth.uid(), 'instructor') AND instructor_id = auth.uid());

-- Admins manage all availability
CREATE POLICY "Admins manage all availability"
  ON public.instructor_availability FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_instructor_availability_updated_at
  BEFORE UPDATE ON public.instructor_availability
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 2. Allow students to book a specific instructor's open slot, with server-side validation
CREATE OR REPLACE FUNCTION public.enforce_booking_student_limits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  is_privileged boolean;
  per_lesson integer;
  local_ts timestamp;
BEGIN
  IF TG_OP = 'INSERT' THEN
    is_privileged := public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'instructor');
  ELSE
    is_privileged := public.has_role(auth.uid(), 'admin')
      OR (public.has_role(auth.uid(), 'instructor') AND OLD.instructor_id = auth.uid());
  END IF;

  IF is_privileged THEN
    RETURN NEW;
  END IF;

  IF TG_OP = 'INSERT' THEN
    NEW.status := 'pending';
    NEW.payment_status := 'unpaid';
    NEW.instructor_notes := NULL;
    NEW.proof_of_payment_path := NULL;
    NEW.proof_submitted_at := NULL;
    NEW.lessons_count := GREATEST(1, COALESCE(NEW.lessons_count, 1));

    IF NEW.package_id IS NOT NULL THEN
      SELECT per_lesson_cents INTO per_lesson
      FROM public.packages
      WHERE id = NEW.package_id AND active = true;
      NEW.amount_cents := COALESCE(per_lesson, 0) * NEW.lessons_count;
    ELSE
      NEW.amount_cents := 0;
    END IF;

    -- A student may request a specific instructor only within a valid open slot.
    IF NEW.instructor_id IS NOT NULL THEN
      IF NOT public.has_role(NEW.instructor_id, 'instructor') THEN
        RAISE EXCEPTION 'Selected instructor is not valid';
      END IF;
      IF NEW.scheduled_at IS NULL THEN
        RAISE EXCEPTION 'A time slot is required when choosing an instructor';
      END IF;

      local_ts := NEW.scheduled_at AT TIME ZONE 'Africa/Johannesburg';

      IF NOT EXISTS (
        SELECT 1 FROM public.instructor_availability a
        WHERE a.instructor_id = NEW.instructor_id
          AND a.active = true
          AND a.day_of_week = EXTRACT(DOW FROM local_ts)::int
          AND local_ts::time >= a.start_time
          AND (local_ts::time + interval '1 hour') <= a.end_time
      ) THEN
        RAISE EXCEPTION 'Selected time is outside the instructor''s availability';
      END IF;

      IF EXISTS (
        SELECT 1 FROM public.bookings b
        WHERE b.instructor_id = NEW.instructor_id
          AND b.status <> 'cancelled'
          AND b.scheduled_at = NEW.scheduled_at
      ) THEN
        RAISE EXCEPTION 'That time slot is already booked';
      END IF;
    END IF;

  ELSIF TG_OP = 'UPDATE' THEN
    NEW.student_id := OLD.student_id;
    NEW.instructor_id := OLD.instructor_id;
    NEW.status := OLD.status;
    NEW.amount_cents := OLD.amount_cents;
    NEW.instructor_notes := OLD.instructor_notes;

    IF NEW.proof_of_payment_path IS DISTINCT FROM OLD.proof_of_payment_path
       AND NEW.proof_of_payment_path IS NOT NULL THEN
      NEW.payment_status := 'proof_submitted';
      NEW.proof_submitted_at := now();
    ELSE
      NEW.proof_of_payment_path := OLD.proof_of_payment_path;
      NEW.payment_status := OLD.payment_status;
      NEW.proof_submitted_at := OLD.proof_submitted_at;
    END IF;
  END IF;

  RETURN NEW;
END;
$function$;