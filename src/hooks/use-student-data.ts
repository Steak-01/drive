import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { useAccount } from "../hooks/use-account";

export interface StudentPkg {
  id: string;
  code: string;
  title: string;
  per_lesson_cents: number;
}

export interface StudentBooking {
  id: string;
  package_id: string | null;
  lessons_count: number;
  amount_cents: number;
  scheduled_at: string | null;
  status: string;
  payment_status: string;
  notes: string | null;
  instructor_notes: string | null;
}

/** Active licence packages (shared cache). */
export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, code, title, per_lesson_cents")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as StudentPkg[];
    },
  });
}

/** The signed-in student's bookings (shared cache). */
export function useMyBookings() {
  const { data: account } = useAccount();
  const userId = account?.userId;
  return useQuery({
    queryKey: ["my-bookings", userId],
    enabled: !!userId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(
          "id, package_id, lessons_count, amount_cents, scheduled_at, status, payment_status, notes, instructor_notes",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StudentBooking[];
    },
  });
}
