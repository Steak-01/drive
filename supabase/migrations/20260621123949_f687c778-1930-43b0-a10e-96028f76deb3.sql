CREATE OR REPLACE FUNCTION public.enforce_booking_student_limits()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_privileged boolean;
  per_lesson integer;
BEGIN
  IF TG_OP = 'INSERT' THEN
    is_privileged := public.has_role(auth.uid(), 'admin')
      OR public.has_role(auth.uid(), 'instructor');
  ELSE
    is_privileged := public.has_role(auth.uid(), 'admin')
      OR (public.has_role(auth.uid(), 'instructor') AND OLD.instructor_id = auth.uid());
  END IF;

  -- Admins and assigned instructors may write all columns freely.
  IF is_privileged THEN
    RETURN NEW;
  END IF;

  -- Otherwise the caller is a student acting on their own booking:
  -- coerce all privileged/financial columns to safe, server-computed values.
  IF TG_OP = 'INSERT' THEN
    NEW.instructor_id := NULL;
    NEW.status := 'pending';
    NEW.payment_status := 'unpaid';
    NEW.instructor_notes := NULL;
    NEW.lessons_count := GREATEST(1, COALESCE(NEW.lessons_count, 1));

    IF NEW.package_id IS NOT NULL THEN
      SELECT per_lesson_cents INTO per_lesson
      FROM public.packages
      WHERE id = NEW.package_id AND active = true;
      NEW.amount_cents := COALESCE(per_lesson, 0) * NEW.lessons_count;
    ELSE
      NEW.amount_cents := 0;
    END IF;
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.student_id := OLD.student_id;
    NEW.instructor_id := OLD.instructor_id;
    NEW.status := OLD.status;
    NEW.payment_status := OLD.payment_status;
    NEW.amount_cents := OLD.amount_cents;
    NEW.instructor_notes := OLD.instructor_notes;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_booking_student_limits_trg ON public.bookings;

CREATE TRIGGER enforce_booking_student_limits_trg
BEFORE INSERT OR UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_student_limits();