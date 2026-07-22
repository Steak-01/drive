import { createFileRoute, Link } from "@tanstack/react-router";
import { User, ShieldCheck, Lock, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/portal")({
  head: () => ({
    meta: [
      { title: "Secure Portal — NJ Shuttle Services" },
      {
        name: "description",
        content:
          "Secure customer and admin portals for booking trips, getting quotes and managing operations.",
      },
      { property: "og:title", content: "Secure Portal — NJ Shuttle Services" },
      {
        property: "og:description",
        content: "Login-first dashboards for customers and admins.",
      },
    ],
  }),
  component: Portal,
});

const portals = [
  {
    icon: User,
    title: "My Account",
    text: "Request trips, view your quotes and bookings, upload proof of payment and track your ride status — all in one place.",
  },
  {
    icon: ShieldCheck,
    title: "Admin Portal",
    text: "Review trip requests, send quotes, manage bookings and handle customer inquiries from one secure dashboard.",
  },
];

function Portal() {
  return (
    <section className="section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-wide text-primary">
            <Lock className="h-3.5 w-3.5" /> Secure login
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase sm:text-5xl">
            Your Dashboard, Your Way
          </h1>
          <p className="mt-4 text-muted-foreground">
            Login-first dashboards for customers and administrators — request trips, get quotes
            and manage payments securely online.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-3xl gap-6 md:grid-cols-2">
          {portals.map((p) => (
            <div
              key={p.title}
              className="flex flex-col rounded-xl border border-border bg-card p-7 shadow-card"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                <p.icon className="h-6 w-6 text-primary" />
              </div>
              <h2 className="mt-4 font-display text-xl font-bold uppercase">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-primary bg-accent/40 p-8 text-center ring-1 ring-primary">
          <h2 className="font-display text-2xl font-bold uppercase">Your secure portal is live</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Create an account or sign in to request trips, track your quotes and bookings, and
            manage everything online. Admins get their own dashboard too.
          </p>
          <Button asChild variant="hero" size="lg" className="mt-6">
            <Link to="/auth">
              Sign in / Create account <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}