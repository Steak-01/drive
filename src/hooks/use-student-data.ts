import { useQuery } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { useAccount } from "../hooks/use-account";

export interface StudentPkg {
  id: string;
  code: string;
  title: string;
  description: string | null;
}

export interface StudentBooking {
  id: string;
  package_id: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  trip_date: string | null;
  passenger_count: number;
  amount_cents: number | null;
  quoted_at: string | null;
  status: string;
  payment_status: string;
  notes: string | null;
}

/** Active trip-category packages (shared cache). */
export function usePackages() {
  return useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, code, title, description")
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
          "id, package_id, pickup_location, dropoff_location, trip_date, passenger_count, amount_cents, quoted_at, status, payment_status, notes",
        )
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as StudentBooking[];
    },
  });
}