DROP POLICY IF EXISTS "Instructors view assigned bookings" ON public.bookings;

CREATE POLICY "Instructors view assigned bookings"
ON public.bookings
FOR SELECT
TO authenticated
USING (auth.uid() = instructor_id);