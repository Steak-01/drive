import {type ReactNode, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../integrations/supabase/client";
import { bootstrapAccount } from "../lib/account.functions";
import { useAccount } from "../hooks/use-account";
import { Button } from "../components/ui/button";
import {
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  GraduationCap,
  CalendarPlus,
  CalendarClock,
} from "lucide-react";

type NavLink = { to: string; label: string; icon: typeof LayoutDashboard };

const STUDENT_LINKS: NavLink[] = [
  { to: "/dashboard", label: "My Lessons", icon: GraduationCap },
  { to: "/book", label: "Book a Lesson", icon: CalendarPlus },
  { to: "/schedule", label: "Schedule", icon: CalendarClock }
];

const ADMIN_LINKS: NavLink[] = [{ to: "/admin", label: "Admin", icon: ShieldCheck }];

export function DashboardShell({
  children,
  area,
}: {
  children: ReactNode;
  area?: "student" | "admin";
}) {
  const { data: account } = useAccount();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const roles = account?.roles ?? [];
  const isAdmin = roles.includes("admin");

  // Ensure profile + role exist (covers Google sign-in / refreshed sessions).
  useEffect(() => {
    bootstrapAccount({}) 
      .then(() => queryClient.invalidateQueries({ queryKey: ["account"] }))
      .catch(() => {});
  }, [queryClient]);

  // Keep each role inside its own area.
  useEffect(() => {
    if (!account || !area) return;

    const target = isAdmin ? "/admin" : "/dashboard";

    if (area === "student" && (isAdmin)) {
      navigate({ to: target, replace: true });
    } 
     else if (area === "admin" && !isAdmin) {
      navigate({ to: target, replace: true });
    }
  }, [account, area, isAdmin, navigate]);

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  const links: NavLink[] = isAdmin ? ADMIN_LINKS : STUDENT_LINKS;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-primary">Dashboard</p>
          <h1 className="font-display text-2xl font-bold uppercase">
            {account?.profile?.full_name || "Welcome"}
          </h1>
        </div>
        <Button variant="outline" size="sm" onClick={signOut}>
          <LogOut className="h-4 w-4" /> Sign out
        </Button>
      </div>

      <nav className="mt-5 flex flex-wrap gap-2">
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            activeOptions={{ exact: true }}
            className="inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted"
            activeProps={{ className: "!border-primary bg-accent !text-primary" }}
          >
            <l.icon className="h-4 w-4" /> {l.label}
          </Link>
        ))}
      </nav>

      <div className="mt-8">{children}</div>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const map: Record<string, string> = {
    pending: "bg-muted text-foreground/70",
    confirmed: "bg-accent text-primary",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-700",
    paid: "bg-green-100 text-green-800",
    unpaid: "bg-muted text-foreground/70",
    proof_submitted: "bg-amber-100 text-amber-800",
    rejected: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${
        map[value] ?? "bg-muted text-foreground/70"
      }`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

export function formatZAR(cents: number): string {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(cents / 100);
}

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: ReactNode;
  icon?: typeof LayoutDashboard;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-wide text-muted-foreground">{label}</p>
        {Icon && <Icon className="h-4 w-4 text-primary" />}
      </div>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}
