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
      pickupLocation: z.string().max(300).nullable(),
      dropoffLocation: z.string().max(300).nullable(),
      tripDate: z.string().nullable(),
      passengerCount: z.number().min(1),
      notes: z.string().max(2000).optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    const { userId, claims } = context;

    const [packageResult, profileResult] = await Promise.all([
      supabase
        .from("packages")
        .select("code, title")
        .eq("id", data.packageId)
        .eq("active", true)
        .maybeSingle(),
      supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle(),
    ]);

    const pkg = packageResult.data;
    if (!pkg) {
      throw new Error("Selected trip type not found");
    }

    // amount_cents is intentionally left unset here — it stays NULL until an
    // admin reviews the request and sets a quote. Never compute or accept a
    // price at booking time.
    const { error } = await supabase.from("bookings").insert({
      student_id: userId,
      package_id: data.packageId,
      pickup_location: data.pickupLocation,
      dropoff_location: data.dropoffLocation,
      trip_date: data.tripDate,
      passenger_count: data.passengerCount,
      notes: data.notes ?? null,
    });

    if (error) {
      throw new Error(error.message);
    }

    const studentName = profileResult.data?.full_name ?? null;
    const studentEmail = claims.email as string | null;

    await sendAdminBookingNotification({
      studentName,
      studentEmail,
      packageCode: pkg.code,
      packageTitle: pkg.title,
      lessonsCount: data.passengerCount,
      scheduledAt: data.tripDate,
      notes: data.notes ?? null,
      pickupLocation: data.pickupLocation,
      dropoffLocation: data.dropoffLocation,
      tripDate: data.tripDate,
      passengerCount: data.passengerCount,
    });

    return { ok: true };
  });