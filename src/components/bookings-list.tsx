import { Link } from "@tanstack/react-router";
import { usePackages, useMyBookings } from "../hooks/use-student-data";
import { StatusBadge, formatZAR } from "../components/dashboard-shell";
import { Button } from "../components/ui/button";
import { PaymentPanel } from "../components/payment-panel";
import { CalendarPlus } from "lucide-react";

/** List of the student's bookings with payment + messaging. */
export function BookingsList() {
  const { data: packages } = usePackages();
  const { data: bookings } = useMyBookings();
  const pkgMap = new Map((packages ?? []).map((p) => [p.id, p]));

  if ((bookings ?? []).length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No trips requested yet. Request your first trip to get started.
        </p>
        <Button asChild variant="hero" size="sm" className="mt-4">
          <Link to="/book">
            <CalendarPlus className="h-4 w-4" /> Request a Trip
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {(bookings ?? []).map((b) => {
        const pkg = b.package_id ? pkgMap.get(b.package_id) : undefined;
        const route = [b.pickup_location, b.dropoff_location].filter(Boolean).join(" → ");

        return (
          <div key={b.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">
                  {pkg ? pkg.title : "Unknown trip type"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {route || "Locations to be confirmed"}
                  {b.passenger_count
                    ? ` · ${b.passenger_count} passenger${b.passenger_count > 1 ? "s" : ""}`
                    : ""}
                </p>
                {b.trip_date && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(b.trip_date).toLocaleString("en-ZA")}
                  </p>
                )}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <StatusBadge value={b.status} />
                <StatusBadge value={b.payment_status} />
              </div>
            </div>

            {b.notes && (
              <p className="mt-3 border-t border-border pt-3 text-sm text-muted-foreground">
                {b.notes}
              </p>
            )}

            {b.amount_cents != null ? (
              <PaymentPanel
                bookingId={b.id}
                paymentStatus={b.payment_status}
                amountLabel={formatZAR(b.amount_cents)}
              />
            ) : (
              <div className="mt-3 rounded-lg border border-dashed border-border p-3 text-sm text-muted-foreground">
                We'll notify you here once your trip has been quoted.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}