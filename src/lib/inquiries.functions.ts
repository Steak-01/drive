import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  service: z.string().trim().max(80).optional().or(z.literal("")),
  message: z.string().trim().min(1).max(1000),
});

/**
 * Public contact-form submission. Unauthenticated on purpose (visitors are not
 * signed in). Input is strictly validated and written server-side; reads are
 * admin-only via RLS + admin functions.
 */
export const submitInquiry = createServerFn({ method: "POST" })
  .validator((d: z.input<typeof inquirySchema>) => inquirySchema.parse(d))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("../integrations/supabase/client.server");
    const { error } = await supabaseAdmin.from("inquiries").insert({
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      service: data.service || null,
      message: data.message,
    });
    if (error) throw new Error("Could not submit your message. Please try again.");
    return { ok: true };
  });
