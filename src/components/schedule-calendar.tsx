import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "../components/ui/button";

export interface ScheduleEvent {
  id: string;
  /** ISO datetime string */
  date: string;
  title: string;
  subtitle?: string;
  status: string;
}

const STATUS_DOT: Record<string, string> = {
  pending: "bg-muted-foreground",
  confirmed: "bg-primary",
  completed: "bg-green-600",
  cancelled: "bg-red-500",
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ScheduleCalendar({
  events,
  title = "Schedule",
}: {
  events: ScheduleEvent[];
  title?: string;
}) {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date>(() => new Date());

  const dated = useMemo(
    () =>
      events
        .filter((e) => e.date)
        .map((e) => ({ ...e, dt: new Date(e.date) }))
        .filter((e) => !Number.isNaN(e.dt.getTime())),
    [events],
  );

  const grid = useMemo(() => {
    const first = startOfMonth(cursor);
    // Monday-first offset
    const offset = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++)
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  const eventsForSelected = useMemo(
    () =>
      dated.filter((e) => sameDay(e.dt, selected)).sort((a, b) => a.dt.getTime() - b.dt.getTime()),
    [dated, selected],
  );

  const today = new Date();

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 font-display text-lg font-bold uppercase">
          <CalendarDays className="h-5 w-5 text-primary" /> {title}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold">
            {cursor.toLocaleDateString("en-ZA", { month: "long", year: "numeric" })}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="pb-1 text-center text-[11px] font-bold uppercase tracking-wide text-muted-foreground"
          >
            {w}
          </div>
        ))}
        {grid.map((cell, i) => {
          if (!cell) return <div key={`e-${i}`} />;
          const dayEvents = dated.filter((e) => sameDay(e.dt, cell));
          const isSelected = sameDay(cell, selected);
          const isToday = sameDay(cell, today);
          return (
            <button
              key={cell.toISOString()}
              type="button"
              onClick={() => setSelected(cell)}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-colors ${
                isSelected
                  ? "border-primary bg-accent font-bold text-primary"
                  : isToday
                    ? "border-primary/40 bg-muted/40"
                    : "border-transparent hover:bg-muted"
              }`}
            >
              <span>{cell.getDate()}</span>
              {dayEvents.length > 0 && (
                <span className="mt-0.5 flex gap-0.5">
                  {dayEvents.slice(0, 3).map((e) => (
                    <span
                      key={e.id}
                      className={`h-1.5 w-1.5 rounded-full ${
                        STATUS_DOT[e.status] ?? "bg-muted-foreground"
                      }`}
                    />
                  ))}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <p className="text-sm font-bold">
          {selected.toLocaleDateString("en-ZA", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })}
        </p>
        <div className="mt-2 space-y-2">
          {eventsForSelected.length === 0 && (
            <p className="text-sm text-muted-foreground">No lessons scheduled.</p>
          )}
          {eventsForSelected.map((e) => (
            <div key={e.id} className="flex items-center gap-3 rounded-lg bg-muted/50 px-3 py-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                  STATUS_DOT[e.status] ?? "bg-muted-foreground"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{e.title}</p>
                {e.subtitle && (
                  <p className="truncate text-xs text-muted-foreground">{e.subtitle}</p>
                )}
              </div>
              <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                {e.dt.toLocaleTimeString("en-ZA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
