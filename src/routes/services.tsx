import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ArrowRight, Plane, MapPin, Compass, Palmtree } from "lucide-react";
import { Button } from "../components/ui/button";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — NJ Shuttle Services" },
      {
        name: "description",
        content:
          "Airport transfers, local trips, day trips and vacation transport — every trip individually quoted, with no hidden fees.",
      },
      { property: "og:title", content: "Services & Pricing — NJ Shuttle Services" },
      {
        property: "og:description",
        content: "Transparent, upfront quotes for every shuttle trip type.",
      },
    ],
  }),
  component: Services,
});

const tripTypes = [
  {
    code: "airport",
    icon: Plane,
    title: "Airport Trips",
    text: "Transfers to and from the airport, timed to your flight.",
  },
  {
    code: "local",
    icon: MapPin,
    title: "Local Trips",
    text: "Trips within the local area — appointments, events and errands.",
  },
  {
    code: "day_trip",
    icon: Compass,
    title: "1 Day Trips",
    text: "Single-day out-of-town trips, there and back in comfort.",
  },
  {
    code: "vacation",
    icon: Palmtree,
    title: "Vacations",
    text: "Multi-day vacation transport for you, your family or your group.",
  },
];

const pricingSteps = [
  {
    n: "01",
    title: "Tell us your trip",
    text: "Pickup, drop-off, date and passenger count.",
  },
  {
    n: "02",
    title: "Get your quote",
    text: "We review the details and send a transparent price — no hidden fees.",
  },
  {
    n: "03",
    title: "Confirm & pay",
    text: "Accept the quote and pay securely online — no cash needed.",
  },
];

function Services() {
  return (
    <>
      <section className="bg-gradient-hero py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Services &amp; Pricing
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase sm:text-5xl">
            Clear, honest pricing
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Airport transfers, local trips, day trips and vacation transport — every trip is
            quoted individually, with no hidden fees. First 10 customers get R150–R200 off.
          </p>
          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-2">
            {[
              "No hidden fees",
              "Transparent, upfront quotes",
              "Pay securely online",
              "Professional, vetted drivers",
            ].map((i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* How pricing works */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase">How pricing works</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Every trip is different, so we don&apos;t publish a fixed price list — tell us your
            trip details and we&apos;ll send you a transparent, upfront quote before you pay
            anything.
          </p>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {pricingSteps.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-7 shadow-card">
                <span className="font-display text-5xl font-bold text-primary/20">{s.n}</span>
                <h3 className="mt-2 font-display text-xl font-bold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trip types */}
      <section className="section-pad pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase">Trip types we cover</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {tripTypes.map((t) => (
              <div
                key={t.code}
                className="flex flex-col rounded-xl border border-border bg-card p-7 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <t.icon className="h-6 w-6 text-primary" />
                  <span className="font-display text-2xl font-bold uppercase">{t.title}</span>
                </div>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{t.text}</p>
                <p className="mt-5 text-sm font-semibold text-primary">
                  Priced per trip — get a free quote in minutes
                </p>
                <Button asChild variant="dark" className="mt-4 w-full">
                  <Link to="/contact">
                    Request a quote <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Contact us to confirm availability, trip details and the opening-special discount.
          </p>
        </div>
      </section>

      <section className="bg-gradient-red text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase">
            Not sure which trip type fits?
          </h2>
          <p className="max-w-xl text-white/90">
            Talk to our team and we&apos;ll recommend the right option for you.
          </p>
          <Button asChild variant="dark" size="xl">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}