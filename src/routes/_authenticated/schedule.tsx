import { useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { usePackages, useMyBookings } from "../../hooks/use-student-data";
import { DashboardShell } from "../../components/dashboard-shell";
import { ScheduleCalendar, type ScheduleEvent } from "../../components/schedule-calendar";

export const Route = createFileRoute("/_authenticated/schedule")({
  head: () => ({ meta: [{ title: "My Schedule — Driving School Dashboard" }] }),
  component: SchedulePage,
});

function SchedulePage() {
  const { data: packages } = usePackages();
  const { data: bookings } = useMyBookings();
  const pkgMap = useMemo(() => new Map((packages ?? []).map((p) => [p.id, p])), [packages]);

  const scheduleEvents = useMemo<ScheduleEvent[]>(
    () =>
      (bookings ?? [])
        .filter((b) => b.trip_date && b.status !== "cancelled")
        .map((b) => {
          const pkg = b.package_id ? pkgMap.get(b.package_id) : undefined;
          return {
            id: b.id,
            date: b.trip_date as string,
            title: pkg ? `${pkg.code} — ${pkg.title}` : "Trip",
            subtitle: `${b.passenger_count} passenger${b.passenger_count > 1 ? "s" : ""}`,
            status: b.status,
          };
        }),
    [bookings, pkgMap],
  );

  return (
    <DashboardShell area="student">
      <h2 className="font-display text-2xl font-bold uppercase">My Schedule</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Every confirmed and upcoming trip in one calendar view.
      </p>
      <div className="mt-6 max-w-3xl">
        <ScheduleCalendar events={scheduleEvents} title="My Schedule" />
      </div>
    </DashboardShell>
  );
}