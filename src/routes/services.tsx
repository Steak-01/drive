import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, Truck, Bus, GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { services, learnersLicence } from "../data/site";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services & Pricing — Nthlakusani & Jama Driving School" },
      {
        name: "description",
        content:
          "Driving lesson pricing for Code 1, 8, 10 & 14, learner's licence prep, vehicle hire and transport. Bundles and per-lesson rates.",
      },
      { property: "og:title", content: "Services & Pricing — Nthlakusani & Jama Driving School" },
      {
        property: "og:description",
        content: "Transparent pricing for all licence codes and shuttle services.",
      },
    ],
  }),
  component: Services,
});

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
            All driving codes, learner&apos;s licence preparation, vehicle hire and transport — with
            no hidden fees. First 10 customers get R150–R200 off.
          </p>
        </div>
      </section>

      {/* Learner's licence */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-xl border border-primary bg-accent/40 p-8 ring-1 ring-primary sm:flex-row sm:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <h2 className="font-display text-2xl font-bold uppercase">
                  {learnersLicence.title}
                </h2>
              </div>
              <p className="mt-2 text-muted-foreground">{learnersLicence.description}</p>
              <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
                {learnersLicence.includes.map((i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-4xl font-bold text-primary">
                {learnersLicence.price}
              </p>
              <Button asChild variant="hero" className="mt-4">
                <Link to="/contact">Book learner&apos;s</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Driving codes */}
      <section className="section-pad pt-0">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase">Driving lesson packages</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <div
                key={s.code}
                className={`flex flex-col rounded-xl border bg-card p-7 shadow-card ${
                  s.featured ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-display text-2xl font-bold uppercase">{s.code}</span>
                    <p className="text-sm font-semibold text-muted-foreground">{s.title}</p>
                  </div>
                  {s.featured && (
                    <span className="rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{s.subtitle}</p>

                <div className="mt-5 flex items-baseline gap-1">
                  <span className="font-display text-4xl font-bold text-primary">
                    {s.perLesson}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground">/ lesson</span>
                </div>

                <dl className="mt-5 divide-y divide-border rounded-lg border border-border">
                  {s.bundles.map((b) => (
                    <div
                      key={b.label}
                      className="flex items-center justify-between px-4 py-2.5 text-sm"
                    >
                      <dt className="text-muted-foreground">{b.label}</dt>
                      <dd className="font-bold">{b.price}</dd>
                    </div>
                  ))}
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Truck className="h-4 w-4" /> {s.hire.label}
                    </dt>
                    <dd className="font-bold">{s.hire.price}</dd>
                  </div>
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="flex items-center gap-2 text-muted-foreground">
                      <Bus className="h-4 w-4" /> Transport
                    </dt>
                    <dd className="font-bold">{s.transport}</dd>
                  </div>
                </dl>

                <Button asChild variant="dark" className="mt-6 w-full">
                  <Link to="/contact">
                    Book {s.code} <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-muted-foreground">
            Prices include study material and transportation where indicated. Vehicle hire applies
            to test day. Contact us to confirm availability and the opening-special discount.
          </p>
        </div>
      </section>

      <section className="bg-gradient-red text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-5 px-4 py-14 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase">Not sure which package?</h2>
          <p className="max-w-xl text-white/90">
            Talk to our team and we&apos;ll recommend the right plan for you.
          </p>
          <Button asChild variant="dark" size="xl">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
