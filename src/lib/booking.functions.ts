import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "../integrations/supabase/client";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import { sendAdminBookingNotification } from "./email";

export const createBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      packageId: z.string().uuid(),
      lessonsCount: z.number().min(1),
      instructorId: z.string().uuid().nullable(),
      scheduledAt: z.string().nullable(),
      notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;

    const [packageResult, profileResult] = await Promise.all([
      supabase
        .from("packages")
        .select("code, title, per_lesson_cents")
        .eq("id", data.packageId)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    const pkg = packageResult.data;
    if (!pkg) {
      throw new Error("Selected package not found");
    }

    const amountCents = pkg.per_lesson_cents * data.lessonsCount;

    const { error } = await supabase.from("bookings").insert({
      student_id: userId,
      package_id: data.packageId,
      lessons_count: data.lessonsCount,
      amount_cents: amountCents,
      instructor_id: data.instructorId,
      scheduled_at: data.scheduledAt,
      notes: data.notes ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    const studentName = profileResult.data?.full_name ?? null;
    const studentEmail = claims.email as string | null;
    const packageCode = pkg.code ?? null;
    const packageTitle = pkg.title ?? null;

    let instructorName: string | null = null;
    if (data.instructorId) {
      const { data: instructorProfile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", data.instructorId)
        .maybeSingle();
      instructorName = instructorProfile?.full_name ?? null;
    }

    await sendAdminBookingNotification({
      studentName,
      studentEmail,
      packageCode,
      packageTitle,
      lessonsCount: data.lessonsCount,
      scheduledAt: data.scheduledAt,
      instructorName,
      notes: data.notes ?? null,
    });

    return { ok: true };
  });