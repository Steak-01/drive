import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ShieldCheck,
  CalendarClock,
  Bus,
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
  Users,
  Tag,
  Plane,
  MapPin,
  Compass,
  Palmtree,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { contactInfo } from "../data/site";
import heroImg from "../assets/logo2.png";
import fleetImg from "../assets/fleet.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NJ Shuttle Services" },
      {
        name: "description",
        content:
          "Airport transfers, corporate shuttles, event transport and inter-city routes across South Africa. Kings of Comfort, Choose Wisely.",
      },
      { property: "og:title", content: "NJ Shuttle Services" },
      {
        property: "og:description",
        content: "Professional shuttle transport with transparent, upfront quotes.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: ShieldCheck,
    title: "Vetted, Professional Drivers",
    text: "Background-checked drivers and roadworthy vehicles on every trip.",
  },
  {
    icon: CalendarClock,
    title: "Easy Online Booking",
    text: "Request a trip in minutes and track its status from your account.",
  },
  {
    icon: Tag,
    title: "Transparent Quotes",
    text: "Every trip is priced individually — no guesswork, no hidden fees.",
  },
  {
    icon: Bus,
    title: "Airport, Local & Day Trips",
    text: "From airport transfers to full vacation transport, we've got the route covered.",
  },
];

const tripTypes = [
  {
    code: "airport",
    icon: Plane,
    title: "Airport Trips",
    text: "Reliable transfers to and from the airport, timed to your flight.",
  },
  {
    code: "local",
    icon: MapPin,
    title: "Local Trips",
    text: "Getting around town — appointments, events, errands and more.",
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

const steps = [
  {
    n: "01",
    title: "Request & Quote",
    text: "Tell us your trip details — pickup, drop-off and dates — and we'll send you a quote.",
  },
  {
    n: "02",
    title: "Confirm & Pay",
    text: "Accept your quote and pay securely online — no cash needed.",
  },
  {
    n: "03",
    title: "Ride & Relax",
    text: "Sit back — our professional drivers get you there safely and on time.",
  },
];

const testimonials = [
  {
    name: "Lerato M.",
    role: "Airport Transfer Customer",
    text: "Booked my airport transfer online and got a quote back within the hour. Driver was on time and so professional.",
  },
  {
    name: "Sipho D.",
    role: "Corporate Shuttle Client",
    text: "We use them for all our staff transport now. Reliable, on time, every time.",
  },
  {
    name: "Naledi K.",
    role: "Vacation Trip Customer",
    text: "They organised transport for our whole family trip. Stress-free from start to finish.",
  },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em]">
              <Award className="h-3.5 w-3.5 text-primary" /> {contactInfo.since}
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[1.05] sm:text-5xl lg:text-6xl">
              Get There Safely, <span className="text-primary">In Comfort</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Airport transfers, corporate shuttles, event transport and inter-city routes across
              South Africa — with vetted, professional drivers who put your safety first.
            </p>
            <p className="mt-4 font-display text-2xl font-bold text-primary">
              {contactInfo.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Book a Trip <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/services">Our Services</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                { icon: Users, stat: "All ages", label: "Welcome" },
                { icon: MapPin, stat: "4 Trip Types", label: "Coverage" },
                { icon: Star, stat: "5-Star", label: "Service" },
              ].map((s) => (
                <div key={s.label}>
                  <s.icon className="h-5 w-5 text-primary" />
                  <p className="mt-2 font-display text-xl font-bold">{s.stat}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <img
              src={heroImg}
              alt="NJ Shuttle Services driver and vehicle"
              className="h-full w-full rounded-xl object-cover"
              width={1600}
              height={1100}
            />
            <div className="absolute -bottom-5 -left-3 hidden rounded-xl bg-background p-4 text-foreground shadow-elegant sm:block">
              <p className="font-display text-2xl font-bold text-primary">R150–R200 OFF</p>
              <p className="text-xs font-semibold text-muted-foreground">First 10 customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Why choose us
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
              Built for safe, comfortable trips
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services preview */}
      <section className="section-pad bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Our services
              </p>
              <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
                Trip types we cover
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">
                See all trip types <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {tripTypes.map((t) => (
              <div
                key={t.code}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex items-center gap-2">
                  <t.icon className="h-5 w-5 text-primary" />
                  <span className="font-display text-lg font-bold uppercase">{t.title}</span>
                </div>
                <p className="mt-3 flex-1 text-sm text-muted-foreground">{t.text}</p>
                <p className="mt-4 text-sm font-semibold text-primary">
                  Get a personalised quote
                </p>
                <Button asChild variant="dark" className="mt-4 w-full">
                  <Link to="/contact">Request a quote</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              How it works
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
              From request to ride
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.n} className="rounded-xl border border-border bg-card p-7 shadow-card">
                <span className="font-display text-5xl font-bold text-primary/20">{s.n}</span>
                <h3 className="mt-2 font-display text-xl font-bold uppercase">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fleet band */}
      <section className="relative overflow-hidden">
        <img
          src={fleetImg}
          alt="NJ Shuttle Services fleet"
          className="h-full w-full object-cover"
          width={1600}
          height={900}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary via-secondary/85 to-secondary/40" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg text-white">
              <Bus className="h-8 w-8 text-primary" />
              <h2 className="mt-4 font-display text-3xl font-bold uppercase sm:text-4xl">
                Our Fleet
              </h2>
              <p className="mt-3 text-white/80">
                Comfortable, roadworthy vehicles maintained to a high standard — because how you
                travel matters as much as where you're going.
              </p>
              <Button asChild variant="hero" size="lg" className="mt-6">
                <Link to="/contact">Get a quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-pad bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
              Testimonials
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
              Trusted by our customers
            </h2>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm text-foreground/90">
                  &ldquo;{t.text}&rdquo;
                </blockquote>
                <figcaption className="mt-5">
                  <p className="font-bold">{t.name}</p>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-red text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold uppercase sm:text-4xl">
            Ready to get moving?
          </h2>
          <p className="max-w-xl text-white/90">
            Join now and lock in the opening special — the first 10 customers save R150–R200.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="dark" size="xl">
              <Link to="/contact">Book a Trip</Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/portal">My Account</Link>
            </Button>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/90">
            {[
              "No cash needed — pay online",
              "Flexible booking, any time",
              "Transparent, upfront quotes",
            ].map((i) => (
              <li key={i} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4" /> {i}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}