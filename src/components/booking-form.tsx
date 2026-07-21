import { useState } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { useAccount } from "../hooks/use-account";
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

interface Pkg {
  id: string;
  code: string;
  title: string;
  description: string;
}

/**
 * Self-contained "Request a Trip" form for students. No pricing is shown or
 * collected here — every trip is quoted individually by an admin after the
 * request comes in, so `amount_cents` is never set from the client.
 */
export function BookingForm({ onBooked }: { onBooked?: () => void }) {
  const { data: account } = useAccount();
  const queryClient = useQueryClient();
  const userId = account?.userId;

  const { data: packages } = useQuery({
    queryKey: ["packages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("packages")
        .select("id, code, title, description")
        .eq("active", true)
        .order("sort_order");
      if (error) throw error;
      return data as Pkg[];
    },
  });

  const [packageId, setPackageId] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [tripDate, setTripDate] = useState("");
  const [passengerCount, setPassengerCount] = useState(1);
  const [notes, setNotes] = useState("");

  const selected = packages?.find((p) => p.id === packageId);

  const resetForm = () => {
    setNotes("");
    setTripDate("");
    setPickupLocation("");
    setDropoffLocation("");
    setPassengerCount(1);
    setPackageId("");
  };

  const createBooking = useMutation({
    mutationFn: async () => {
      if (!userId || !selected) throw new Error("Select a trip type");

      const { error } = await supabase.from("bookings").insert({
        student_id: userId,
        package_id: selected.id,
        pickup_location: pickupLocation || null,
        dropoff_location: dropoffLocation || null,
        trip_date: tripDate ? new Date(tripDate).toISOString() : null,
        passenger_count: passengerCount,
        notes: notes || null,
        // amount_cents is intentionally omitted — it stays NULL until an
        // admin sets the quote; a student booking can never carry a price.
      });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Trip requested! We'll send you a quote shortly.");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["my-bookings", userId] });
      onBooked?.();
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Booking failed"),
  });

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-card">
      <h2 className="flex items-center gap-2 font-display text-xl font-bold uppercase">
        <CalendarPlus className="h-5 w-5 text-primary" /> Request a Trip
      </h2>
      <form
        className="mt-5 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          createBooking.mutate();
        }}
      >
        <div className="space-y-1.5">
          <Label>Trip type</Label>
          <Select value={packageId} onValueChange={setPackageId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a trip type" />
            </SelectTrigger>
            <SelectContent>
              {(packages ?? []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.title}
                  {p.description ? ` — ${p.description}` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="pickup">Pickup location</Label>
            <Input
              id="pickup"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="e.g. Tsakane, Brakpan"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dropoff">Drop-off location</Label>
            <Input
              id="dropoff"
              value={dropoffLocation}
              onChange={(e) => setDropoffLocation(e.target.value)}
              placeholder="e.g. OR Tambo Airport"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="tripDate">Trip date</Label>
            <Input
              id="tripDate"
              type="date"
              min={new Date().toISOString().slice(0, 10)}
              value={tripDate}
              onChange={(e) => setTripDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="passengers">Passengers</Label>
            <Input
              id="passengers"
              type="number"
              min={1}
              value={passengerCount}
              onChange={(e) =>
                setPassengerCount(Math.max(1, Number(e.target.value) || 1))
              }
            />
          </div>
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

        <div className="rounded-lg bg-accent px-4 py-3 text-sm text-muted-foreground">
          We'll review your request and send you a price quote before confirming.
        </div>

        <Button
          type="submit"
          variant="hero"
          className="w-full"
          disabled={createBooking.isPending || !selected}
        >
          {createBooking.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
          Request Booking
        </Button>
      </form>
    </div>
  );
}