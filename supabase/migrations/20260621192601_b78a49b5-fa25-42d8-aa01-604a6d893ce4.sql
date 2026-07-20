-- Messaging: per-booking conversation threads between students, their assigned instructor, and admins.

-- Helper: who may participate in a booking's conversation?
CREATE OR REPLACE FUNCTION public.can_access_booking(_booking_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.bookings b
    WHERE b.id = _booking_id
      AND (
        b.student_id = _user_id
        OR b.instructor_id = _user_id
        OR public.has_role(_user_id, 'admin')
      )
  )
$$;

CREATE TABLE public.messages (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body text NOT NULL,
  read_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX idx_messages_booking_id ON public.messages(booking_id);

GRANT SELECT, INSERT, UPDATE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Participants (student, assigned instructor, admin) can read a booking's messages.
CREATE POLICY "Participants read booking messages"
ON public.messages FOR SELECT
TO authenticated
USING (public.can_access_booking(booking_id, auth.uid()));

-- Participants can send a message as themselves.
CREATE POLICY "Participants send booking messages"
ON public.messages FOR INSERT
TO authenticated
WITH CHECK (
  sender_id = auth.uid()
  AND public.can_access_booking(booking_id, auth.uid())
);

-- Participants can mark messages in their booking as read (cannot edit body via app logic).
CREATE POLICY "Participants update booking messages"
ON public.messages FOR UPDATE
TO authenticated
USING (public.can_access_booking(booking_id, auth.uid()))
WITH CHECK (public.can_access_booking(booking_id, auth.uid()));