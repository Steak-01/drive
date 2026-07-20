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
        b.scheduled_at &&
        new Date(b.scheduled_at).getTime() > Date.now() &&
        b.status !== "cancelled" &&
        b.status !== "completed",
    );
    const totalLessons = all
      .filter((b) => b.status !== "cancelled")
      .reduce((sum, b) => sum + b.lessons_count, 0);
    const nextLesson =
      upcoming
        .slice()
        .sort(
          (a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime(),
        )[0]?.scheduled_at ?? null;
    return { completed, totalLessons, upcoming: upcoming.length, nextLesson };
  }, [bookings]);

  return (
    <DashboardShell area="student">
      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Booked lessons" value={progress.totalLessons} icon={GraduationCap} />
        <StatCard label="Completed" value={progress.completed} icon={CheckCircle2} />
        <StatCard label="Upcoming" value={progress.upcoming} icon={CalendarClock} />
        <StatCard
          label="Next lesson"
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
