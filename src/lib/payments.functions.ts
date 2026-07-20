import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";

const PROOFS_BUCKET = "payment-proofs";
const MAX_BYTES = 8 * 1024 * 1024; // 8MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "application/pdf"];

function extFor(contentType: string): string {
  switch (contentType) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "application/pdf":
      return "pdf";
    default:
      return "bin";
  }
}

/**
 * Student uploads proof of payment for their own booking.
 * The file is stored privately; the booking is flagged "proof_submitted"
 * by the booking trigger once the file path is set.
 */
export const submitPaymentProof = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: { bookingId: string; fileBase64: string; contentType: string; reference?: string }) =>
      z
        .object({
          bookingId: z.string().uuid(),
          fileBase64: z.string().min(10),
          contentType: z.enum(["image/png", "image/jpeg", "image/webp", "application/pdf"]),
          reference: z.string().max(120).optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    // Verify the booking belongs to this student.
    const { data: booking, error: bErr } = await supabase
      .from("bookings")
      .select("id, student_id")
      .eq("id", data.bookingId)
      .eq("student_id", userId)
      .maybeSingle();
    if (bErr) throw new Error(bErr.message);
    if (!booking) throw new Error("Booking not found");

    if (!ALLOWED_TYPES.includes(data.contentType)) throw new Error("Unsupported file type");

    const bytes = Buffer.from(data.fileBase64, "base64");
    if (bytes.byteLength === 0) throw new Error("Empty file");
    if (bytes.byteLength > MAX_BYTES) throw new Error("File too large (max 8MB)");

    const path = `${userId}/${data.bookingId}/${Date.now()}.${extFor(data.contentType)}`;

    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const { error: upErr } = await supabaseAdmin.storage
      .from(PROOFS_BUCKET)
      .upload(path, bytes, { contentType: data.contentType, upsert: true });
    if (upErr) throw new Error(upErr.message);

    // Update the booking as the student — trigger sets payment_status + timestamp.
    const { error: updErr } = await supabase
      .from("bookings")
      .update({
        proof_of_payment_path: path,
        payment_reference: data.reference ?? null,
      })
      .eq("id", data.bookingId)
      .eq("student_id", userId);
    if (updErr) throw new Error(updErr.message);

    return { ok: true };
  });

/** Student fetches a temporary signed URL to view their own uploaded proof. */
export const getMyProofUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { bookingId: string }) => z.object({ bookingId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ url: string | null }> => {
    const { supabase, userId } = context;
    const { data: booking } = await supabase
      .from("bookings")
      .select("proof_of_payment_path, student_id")
      .eq("id", data.bookingId)
      .eq("student_id", userId)
      .maybeSingle();
    if (!booking?.proof_of_payment_path) return { url: null };

    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const { data: signed } = await supabaseAdmin.storage
      .from(PROOFS_BUCKET)
      .createSignedUrl(booking.proof_of_payment_path, 60 * 10);
    return { url: signed?.signedUrl ?? null };
  });
