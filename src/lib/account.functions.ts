import { supabase } from "../integrations/supabase/client";

export type AppRole = "student" | "admin";

export interface AccountInfo {
  userId: string;
  email: string | null;
  profile: {
    id: string;
    full_name: string | null;
    phone: string | null;
    avatar_url: string | null;
  } | null;
  roles: AppRole[];
}

async function requireUserId(): Promise<string> {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("Not authenticated");
  return data.user.id;
}

/** Ensures a profile row exists and the user has at least the `student` role. */
export async function bootstrapAccount(input: { fullName?: string; phone?: string } = {}) {
  const userId = await requireUserId();

  const { data: existing, error: existingError } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();
  if (existingError) throw new Error(existingError.message);

  if (!existing) {
    const { error } = await supabase.from("profiles").insert({
      id: userId,
      full_name: input.fullName ?? null,
      phone: input.phone ?? null,
    });
    if (error) throw new Error(error.message);
  } else if (input.fullName || input.phone) {
    const { error } = await supabase
      .from("profiles")
      .update({
        ...(input.fullName ? { full_name: input.fullName } : {}),
        ...(input.phone ? { phone: input.phone } : {}),
      })
      .eq("id", userId);
    if (error) throw new Error(error.message);
  }

  const { data: roles, error: rolesError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (rolesError) throw new Error(rolesError.message);

  if (!roles || roles.length === 0) {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "student" });
    if (error) throw new Error(error.message);
  }

  return { ok: true };
}

/** Returns the current user's profile, email and roles (RLS-scoped to self). */
export async function getMyAccount(): Promise<AccountInfo> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) throw new Error("Not authenticated");
  const userId = userData.user.id;

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, full_name, phone, avatar_url")
    .eq("id", userId)
    .maybeSingle();
  if (profileError) throw new Error(profileError.message);

  const { data: roleRows, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", userId);
  if (roleError) throw new Error(roleError.message);

  return {
    userId,
    email: userData.user.email ?? null,
    profile: profile ?? null,
    roles: (roleRows ?? []).map((r: any) => r.role),
  };
}

/** Updates the current user's own profile fields. */
export async function updateMyProfile(input: {
  full_name?: string;
  phone?: string;
  avatar_url?: string;
}) {
  const userId = await requireUserId();
  const { error } = await supabase.from("profiles").update(input).eq("id", userId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

/**
 * First-run setup helper: grants the caller the `admin` role only if no admin
 * exists yet. See security note below — this must be backed by a
 * SECURITY DEFINER RPC, not plain table calls, to stay safe client-side.
 */
export async function claimAdminIfNone() {
  const userId = await requireUserId();

  const { data, error } = await supabase.rpc("claim_admin_if_none", {
    _user_id: userId,
  });
  if (error) throw new Error(error.message);

  const result = data?.[0];
  return {
    granted: result?.granted ?? false,
    reason: (result?.reason ?? undefined) as "admin_exists" | undefined,
  };
}