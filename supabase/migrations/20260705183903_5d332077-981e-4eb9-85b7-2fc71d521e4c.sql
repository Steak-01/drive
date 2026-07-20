-- Structured per-student driving skill progress
CREATE TABLE public.student_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  skill_key text NOT NULL,
  level integer NOT NULL DEFAULT 0,
  instructor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (student_id, skill_key),
  CONSTRAINT student_skills_level_range CHECK (level >= 0 AND level <= 3)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.student_skills TO authenticated;
GRANT ALL ON public.student_skills TO service_role;

ALTER TABLE public.student_skills ENABLE ROW LEVEL SECURITY;

-- Security-definer helper: is the current user an instructor who teaches this student?
CREATE OR REPLACE FUNCTION public.instructor_of_student(_student_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.student_id = _student_id
      AND b.instructor_id = auth.uid()
  )
$$;

-- Students can read their own progress.
CREATE POLICY "Students read own skills"
ON public.student_skills FOR SELECT
TO authenticated
USING (
  student_id = auth.uid()
  OR public.instructor_of_student(student_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Instructors (of that student) and admins can create progress rows.
CREATE POLICY "Instructors create skills"
ON public.student_skills FOR INSERT
TO authenticated
WITH CHECK (
  public.instructor_of_student(student_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Instructors (of that student) and admins can update progress rows.
CREATE POLICY "Instructors update skills"
ON public.student_skills FOR UPDATE
TO authenticated
USING (
  public.instructor_of_student(student_id)
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.instructor_of_student(student_id)
  OR public.has_role(auth.uid(), 'admin')
);

CREATE TRIGGER update_student_skills_updated_at
BEFORE UPDATE ON public.student_skills
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();