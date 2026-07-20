import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { supabase } from "../integrations/supabase/client";
import { useAccount } from "../hooks/use-account";
import { formatZAR } from "../components/dashboard-shell";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { toast } from "sonner";
import { Loader2, CalendarPlus } from "lucide-react";

const NO_PREFERENCE = "none";
const SA_OFFSET = "+02:00";

interface Pkg {
  id: string;
  code: string;
  title: string;
  per_lesson_cents: number;
  description: string;
}

/** Self-contained "Book a Lesson" form for students. */
export function BookingForm({ onBooked }: { onBooked?: () => void }) {
  const { data: account } = useAccount();
  const queryClient = useQueryClient();
  const userId = account?.userId;

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, code, title, per_lesson_cents, description")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Pkg[];
    },
  });

  const [packageId, setPackageId] = useState("");
  const [lessons, setLessons] = useState(1);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const selected = packages?.find((p) => p.id === packageId);
  const total = selected ? selected.per_lesson_cents * lessons : 0;

  const resetForm = () => {
    setNotes("");
    setDate("");
    setLessons(1);
    setPackageId("");
  };

  const createBooking = useMutation({
    mutationFn: async () => {
      if (!userId || !selected) throw new Error("Select a package");
      let scheduledAt: string | null = null;

      const { error } = await supabase.from("bookings").insert({
        student_id: userId,
        package_id: selected.id,
        lessons_count: lessons,
        amount_cents: selected.per_lesson_cents * lessons,
        scheduled_at: scheduledAt,
        notes: notes || null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Lesson booked! We'll confirm shortly.");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["my-bookings", userId] });
      onBooked?.();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Booking failed"),
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
        <CalendarPlus className="h-5 w-5 text-primary" /> Book a Lesson
      </h2>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          createBooking.mutate();
        }}
      >
        <div className="space-y-1.5">
          <Label>Licence package</Label>
          <Select value={packageId} onValueChange={setPackageId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a package" />
            </SelectTrigger>
            <SelectContent>
              {(packages ?? []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.code} — {p.title} ({formatZAR(p.per_lesson_cents)}/{p.description})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">Preferred date</Label>
          <Input
            id="date"
            type="date"
            min={new Date().toISOString().slice(0, 10)}
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
            }}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know?"
            rows={3}
          />
        </div>
        {selected && (
          <div className="flex items-center justify-between rounded-lg bg-accent px-4 py-3">
            <span className="text-sm font-semibold">Estimated total</span>
            <span className="font-display text-lg font-bold text-primary">
              {formatZAR(total)}
            </span>
          </div>
        )}
        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={
            createBooking.isPending ||
            !selected
          }
        >
          {createBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Request Booking
        </Button>
      </form>
    </div>
  );
}