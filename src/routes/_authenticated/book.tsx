import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "../../components/dashboard-shell";
import { BookingForm } from "../../components/booking-form";

export const Route = createFileRoute("/_authenticated/book")({
  head: () => ({ meta: [{ title: "Book a Lesson — Driving School Dashboard" }] }),
  component: BookPage,
});

function BookPage() {
  const navigate = Route.useNavigate();
  return (
    <DashboardShell area="student">
      <div className="mx-auto max-w-xl">
        <h2 className="font-display text-2xl font-bold uppercase">Book a Lesson</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a package, an instructor and a time. We'll confirm your booking shortly.
        </p>
        <div className="mt-6">
          <BookingForm onBooked={() => navigate({ to: "/dashboard" })} />
        </div>
      </div>
    </DashboardShell>
  );
}
