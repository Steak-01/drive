import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "../integrations/supabase/auth-middleware";
import type { AppRole } from "./account.functions";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "../integrations/supabase/types";

interface AdminContext {
  userId: string;
  supabase: SupabaseClient<Database>;
}

async function assertAdmin(context: AdminContext) {
  const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
    _user_id: context.userId,
    _role: "admin",
  });
  if (error || !isAdmin) throw new Error("Forbidden");
}

export interface AdminUser {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  roles: AppRole[];
  created_at: string;
}

export interface AdminBooking {
  id: string;
  student_id: string;
  student_name: string | null;
  student_email: string | null;
  package_code: string | null;
  package_title: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  trip_date: string | null;
  passenger_count: number;
  amount_cents: number | null;
  quoted_at: string | null;
  quoted_by: string | null;
  status: string;
  payment_status: string;
  notes: string | null;
  proof_of_payment_path: string | null;
  proof_submitted_at: string | null;
  payment_reference: string | null;
  created_at: string;
}

export const adminListUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");

    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name, phone");
    const { data: roleRows } = await supabaseAdmin.from("user_roles").select("user_id, role");

    const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
    const roleMap = new Map<string, AppRole[]>();
    for (const r of roleRows ?? []) {
      const arr = roleMap.get(r.user_id) ?? [];
      arr.push(r.role as AppRole);
      roleMap.set(r.user_id, arr);
    }

    return (list?.users ?? []).map((u) => ({
      id: u.id,
      email: u.email ?? null,
      full_name: profileMap.get(u.id)?.full_name ?? null,
      phone: profileMap.get(u.id)?.phone ?? null,
      roles: roleMap.get(u.id) ?? [],
      created_at: u.created_at,
    }));
  });

export const adminSetRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { userId: string; role: AppRole; action: "add" | "remove" }) =>
    z
      .object({
        userId: z.string().uuid(),
        role: z.enum(["student", "admin"]),
        action: z.enum(["add", "remove"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");

    if (data.action === "add") {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: data.userId, role: data.role }, { onConflict: "user_id,role" });
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("user_roles")
        .delete()
        .eq("user_id", data.userId)
        .eq("role", data.role);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminListBookings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminBooking[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");

    const { data: bookings } = await supabaseAdmin
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    const { data: profiles } = await supabaseAdmin.from("profiles").select("id, full_name");
    const { data: packages } = await supabaseAdmin.from("packages").select("id, code, title");
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });

    const nameMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));
    const pkgMap = new Map((packages ?? []).map((p) => [p.id, p]));
    const emailMap = new Map((list?.users ?? []).map((u) => [u.id, u.email ?? null]));

    return (bookings ?? []).map((b) => ({
      id: b.id,
      student_id: b.student_id,
      student_name: nameMap.get(b.student_id) ?? null,
      student_email: emailMap.get(b.student_id) ?? null,
      package_code: b.package_id ? (pkgMap.get(b.package_id)?.code ?? null) : null,
      package_title: b.package_id ? (pkgMap.get(b.package_id)?.title ?? null) : null,
      pickup_location: b.pickup_location,
      dropoff_location: b.dropoff_location,
      trip_date: b.trip_date,
      passenger_count: b.passenger_count,
      amount_cents: b.amount_cents,
      quoted_at: b.quoted_at,
      quoted_by: b.quoted_by,
      status: b.status,
      payment_status: b.payment_status,
      notes: b.notes,
      proof_of_payment_path: b.proof_of_payment_path ?? null,
      proof_submitted_at: b.proof_submitted_at ?? null,
      payment_reference: b.payment_reference ?? null,
      created_at: b.created_at,
    }));
  });

export const adminUpdateBooking = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (d: {
      bookingId: string;
      status?: string;
      tripDate?: string | null;
      pickupLocation?: string | null;
      dropoffLocation?: string | null;
      passengerCount?: number;
      notes?: string | null;
    }) =>
      z
        .object({
          bookingId: z.string().uuid(),
          status: z
            .enum(["pending_quote", "quoted", "confirmed", "completed", "cancelled"])
            .optional(),
          tripDate: z.string().nullable().optional(),
          pickupLocation: z.string().max(300).nullable().optional(),
          dropoffLocation: z.string().max(300).nullable().optional(),
          passengerCount: z.number().min(1).optional(),
          notes: z.string().max(2000).nullable().optional(),
        })
        .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Run as the authenticated admin so the booking trigger recognises the
    // caller as privileged (auth.uid() = admin) and does not revert changes.
    const patch: {
      status?: string;
      trip_date?: string | null;
      pickup_location?: string | null;
      dropoff_location?: string | null;
      passenger_count?: number;
      notes?: string | null;
    } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.tripDate !== undefined) patch.trip_date = data.tripDate;
    if (data.pickupLocation !== undefined) patch.pickup_location = data.pickupLocation;
    if (data.dropoffLocation !== undefined) patch.dropoff_location = data.dropoffLocation;
    if (data.passengerCount !== undefined) patch.passenger_count = data.passengerCount;
    if (data.notes !== undefined) patch.notes = data.notes;
    const { error } = await context.supabase
      .from("bookings")
      .update(patch)
      .eq("id", data.bookingId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/**
 * Admin sets or updates the price quote for a booking. `quoted_at` and
 * `quoted_by` are always stamped server-side from the authenticated admin —
 * never taken from client input. On the first quote, status advances from
 * pending_quote to quoted automatically.
 */
export const adminSetBookingQuote = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { bookingId: string; amountCents: number }) =>
    z
      .object({
        bookingId: z.string().uuid(),
        amountCents: z.number().int().min(0),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Run as the authenticated admin so the booking trigger recognises the
    // caller as privileged and applies the quote instead of reverting it.
    const { data: existing, error: fetchErr } = await context.supabase
      .from("bookings")
      .select("status")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (fetchErr) throw new Error(fetchErr.message);

    const patch: {
      amount_cents: number;
      quoted_at: string;
      quoted_by: string;
      status?: string;
    } = {
      amount_cents: data.amountCents,
      quoted_at: new Date().toISOString(),
      quoted_by: context.userId,
    };
    if (existing?.status === "pending_quote") patch.status = "quoted";

    const { error } = await context.supabase
      .from("bookings")
      .update(patch)
      .eq("id", data.bookingId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

/** Admin fetches a temporary signed URL to view a booking's proof of payment. */
export const adminGetProofUrl = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { bookingId: string }) => z.object({ bookingId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }): Promise<{ url: string | null }> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const { data: booking } = await supabaseAdmin
      .from("bookings")
      .select("proof_of_payment_path")
      .eq("id", data.bookingId)
      .maybeSingle();
    if (!booking?.proof_of_payment_path) return { url: null };
    const { data: signed } = await supabaseAdmin.storage
      .from("payment-proofs")
      .createSignedUrl(booking.proof_of_payment_path, 60 * 10);
    return { url: signed?.signedUrl ?? null };
  });

/**
 * Admin approves or rejects a submitted proof of payment.
 * Approving marks the booking paid and confirms it (activates the plan).
 */
export const adminReviewPayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { bookingId: string; decision: "approve" | "reject" }) =>
    z
      .object({
        bookingId: z.string().uuid(),
        decision: z.enum(["approve", "reject"]),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    // Run as the authenticated admin so the booking trigger treats the caller
    // as privileged and applies the status/payment change instead of reverting.
    const patch =
      data.decision === "approve"
        ? { payment_status: "paid", status: "confirmed" }
        : { payment_status: "rejected" };
    const { error } = await context.supabase
      .from("bookings")
      .update(patch)
      .eq("id", data.bookingId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminCreateAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { email: string; password: string; fullName: string; phone?: string }) =>
    z
      .object({
        email: z.string().trim().email().max(255),
        password: z.string().min(8).max(72),
        fullName: z.string().trim().min(1).max(120),
        phone: z.string().trim().max(40).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }): Promise<{ userId: string }> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName },
    });
    if (createErr || !created?.user) {
      throw new Error(createErr?.message ?? "Could not create admin");
    }
    const newId = created.user.id;

    const { error: profileErr } = await supabaseAdmin
      .from("profiles")
      .upsert(
        { id: newId, full_name: data.fullName, phone: data.phone ?? null },
        { onConflict: "id" },
      );
    if (profileErr) throw new Error(profileErr.message);

    const { error: roleErr } = await supabaseAdmin
      .from("user_roles")
      .upsert({ user_id: newId, role: "admin" }, { onConflict: "user_id,role" });
    if (roleErr) throw new Error(roleErr.message);

    return { userId: newId };
  });

export interface AdminInquiry {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
}

/** Admin lists all contact-form inquiries, newest first. */
export const adminListInquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminInquiry[]> => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    return (data ?? []) as AdminInquiry[];
  });

/** Admin updates an inquiry's handling status and/or internal notes. */
export const adminUpdateInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: { inquiryId: string; status?: string; admin_notes?: string }) =>
    z
      .object({
        inquiryId: z.string().uuid(),
        status: z.enum(["new", "in_progress", "resolved"]).optional(),
        admin_notes: z.string().max(2000).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const patch: { status?: string; admin_notes?: string } = {};
    if (data.status !== undefined) patch.status = data.status;
    if (data.admin_notes !== undefined) patch.admin_notes = data.admin_notes;
    const { error } = await supabaseAdmin.from("inquiries").update(patch).eq("id", data.inquiryId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });