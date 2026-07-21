import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMyBookings } from "../../hooks/use-student-data";
import { DashboardShell, StatCard } from "../../components/dashboard-shell";
import { BookingsList } from "../../components/bookings-list";
import { GraduationCap, CalendarClock, CheckCircle2, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "My Lessons — Driving School Dashboard" }] }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const { data: bookings } = useMyBookings();

  const progress = useMemo(() => {
    const all = bookings ?? [];

    const completed = all.filter((b) => b.status === "completed").length;

    const upcoming = all.filter(
      (b) =>
        b.trip_date &&
        new Date(b.trip_date).getTime() > Date.now() &&
        b.status !== "cancelled" &&
        b.status !== "completed",
    );

    // "lessons_count" doesn't exist on the bookings table — the closest
    // real signal is the number of non-cancelled bookings themselves.
    const totalBookings = all.filter((b) => b.status !== "cancelled").length;

    const nextLesson =
      upcoming
        .slice()
        .sort(
          (a, b) => new Date(a.trip_date!).getTime() - new Date(b.trip_date!).getTime(),
        )[0]?.trip_date ?? null;

    return { completed, totalBookings, upcoming: upcoming.length, nextLesson };
  }, [bookings]);

  return (
    <DashboardShell area="student">
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Booked trips" value={progress.totalBookings} icon={GraduationCap} />
        <StatCard label="Completed" value={progress.completed} icon={CheckCircle2} />
        <StatCard label="Upcoming" value={progress.upcoming} icon={CalendarClock} />
        <StatCard
          label="Next trip"
          value={
            progress.nextLesson
              ? new Date(progress.nextLesson).toLocaleDateString("en-ZA", {
                  day: "numeric",
                  month: "short",
                })
              : "—"
          }
          icon={TrendingUp}
        />
      </div>

      <h2 className="font-display text-xl font-bold uppercase">My Bookings</h2>
      <div className="mt-4">
        <BookingsList />
      </div>
    </DashboardShell>
  );
}