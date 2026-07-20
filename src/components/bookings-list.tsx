import { Link } from "@tanstack/react-router";
import { usePackages, useMyBookings } from "../hooks/use-student-data";
import { StatusBadge, formatZAR } from "../components/dashboard-shell";
import { Button } from "../components/ui/button";
import { PaymentPanel } from "../components/payment-panel";
import { TrendingUp, CalendarPlus } from "lucide-react";

/** List of the student's bookings with payment + messaging. */
export function BookingsList() {
  const { data: packages } = usePackages();
  const { data: bookings } = useMyBookings();
  const pkgMap = new Map((packages ?? []).map((p) => [p.id, p]));

  if ((bookings ?? []).length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          No bookings yet. Book your first driving lesson to get started.
        </p>
        <Button asChild variant="hero" size="sm" className="mt-4">
          <Link to="/book">
            <CalendarPlus className="h-4 w-4" /> Book a Lesson
          </Link>
        </Button>
      </div>
    );
  }

  console.log('packages:', packages);
  console.log('pkgMap size:', pkgMap.size);

  return (
    <div className="space-y-3">
      {(bookings ?? []).map((b) => {
        const pkg = b.package_id ? pkgMap.get(b.package_id) : undefined;
        console.log('booking package_ids:', bookings?.map(b => b.package_id));
        console.log('sample pkg id:', packages?.[0]?.id, typeof packages?.[0]?.id);
        console.log('sample booking package_id:', bookings?.[0]?.package_id, typeof bookings?.[0]?.package_id);
        return (
          <div key={b.id} className="rounded-xl border border-border bg-card p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-display text-lg font-bold">
                  {pkg ? `${pkg.code} — ${pkg.title}` : "Unknown package"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {b.lessons_count} lesson{b.lessons_count > 1 ? "s" : ""} ·{" "}
                  {formatZAR(b.amount_cents)}
                </p>
                {b.scheduled_at && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(b.scheduled_at).toLocaleString("en-ZA")}
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
            {b.instructor_notes && (
              <div className="mt-3 rounded-lg border border-primary/30 bg-accent/40 p-3">
                <p className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-primary">
                  <TrendingUp className="h-3.5 w-3.5" /> Instructor progress notes
                </p>
                <p className="mt-1 text-sm text-foreground">{b.instructor_notes}</p>
              </div>
            )}
            <PaymentPanel
              bookingId={b.id}
              paymentStatus={b.payment_status}
              amountLabel={formatZAR(b.amount_cents)}
            />
          </div>
        );
      })}
    </div>
  );
}
