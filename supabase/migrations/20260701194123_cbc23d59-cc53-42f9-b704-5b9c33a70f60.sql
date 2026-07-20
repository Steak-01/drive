-- Add proof-of-payment fields to bookings
ALTER TABLE public.bookings
  ADD COLUMN IF NOT EXISTS proof_of_payment_path text,
  ADD COLUMN IF NOT EXISTS proof_submitted_at timestamptz,
  ADD COLUMN IF NOT EXISTS payment_reference text;

-- Update the student-limits trigger to allow students to submit proof of payment
CREATE OR REPLACE FUNCTION public.enforce_booking_student_limits()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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
  ELSIF TG_OP = 'UPDATE' THEN
    NEW.student_id := OLD.student_id;
    NEW.instructor_id := OLD.instructor_id;
    NEW.status := OLD.status;
    NEW.amount_cents := OLD.amount_cents;
    NEW.instructor_notes := OLD.instructor_notes;

    -- Students may submit / re-submit proof of payment only.
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