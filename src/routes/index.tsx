import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Car,
  GraduationCap,
  ShieldCheck,
  CalendarClock,
  BookOpen,
  Bus,
  CheckCircle2,
  ArrowRight,
  Star,
  Award,
  Users,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { services, learnersLicence, contactInfo } from "../data/site";
import heroImg from "../assets/relate.png";
import fleetImg from "../assets/fleet.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nthlakusani & Jama Driving School & Shuttle Services" },
      {
        name: "description",
        content:
          "Learn to drive with confidence. Code 1, 8, 10 & 14 lessons, learner's licence prep and shuttle services. We Drive You Forward!",
      },
      { property: "og:title", content: "Nthlakusani & Jama Driving School & Shuttle Services" },
      {
        property: "og:description",
        content: "Professional driving lessons, learner's licence prep and shuttle services.",
      },
    ],
  }),
  component: Home,
});

const features = [
  {
    icon: ShieldCheck,
    title: "Patient, Certified Instructors",
    text: "Friendly professionals who teach drivers of all ages and skill levels.",
  },
  {
    icon: CalendarClock,
    title: "Flexible Scheduling",
    text: "Book lessons online and pick time slots that fit your week.",
  },
  {
    icon: BookOpen,
    title: "Study Material & Practice Tests",
    text: "Everything you need to pass the theory and learner's exam.",
  },
  {
    icon: Bus,
    title: "Shuttle & Transport",
    text: "Reliable transport to your test and lessons, included where applicable.",
  },
];

const steps = [
  {
    n: "01",
    title: "Register & Book",
    text: "Create an account and choose your licence code and lesson package.",
  },
  {
    n: "02",
    title: "Learn & Track",
    text: "Train with your instructor and track your progress toward the test.",
  },
  {
    n: "03",
    title: "Pass & Drive",
    text: "Hire a vehicle for test day and get your licence. We drive you forward!",
  },
];

const testimonials = [
  {
    name: "Lerato M.",
    role: "Code 8 Graduate",
    text: "Passed first time! The instructors were patient and the practice tests made the theory so easy.",
  },
  {
    name: "Sipho D.",
    role: "Code 10 Learner",
    text: "Booking online and tracking my lessons kept me on schedule. Highly professional team.",
  },
  {
    name: "Naledi K.",
    role: "Learner's Licence",
    text: "They sorted my study material and transport. Stress-free from start to finish.",
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
              Learn to Drive with <span className="text-primary">Confidence</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/80">
              Professional driving lessons, learner&apos;s licence preparation and shuttle services.
              Code 1, 8, 10 &amp; 14 — taught by certified instructors who put your safety first.
            </p>
            <p className="mt-4 font-display text-2xl font-bold text-primary">
              {contactInfo.tagline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/contact">
                  Book a Lesson <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outlineLight" size="xl">
                <Link to="/services">View Pricing</Link>
              </Button>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/15 pt-6">
              {[
                { icon: Users, stat: "All ages", label: "Welcome" },
                { icon: Car, stat: "4 Codes", label: "Licences" },
                { icon: Star, stat: "First-time", label: "Pass focus" },
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
              alt="Driving instructor teaching a learner driver"
              className="aspect-[4/3] w-full rounded-xl object-cover shadow-strong"
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
              Built for safe, confident drivers
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
                Licence codes &amp; pricing
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/services">
                Full price list <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div
                key={s.code}
                className={`relative flex flex-col rounded-xl border bg-card p-6 shadow-card ${
                  s.featured ? "border-primary ring-1 ring-primary" : "border-border"
                }`}
              >
                {s.featured && (
                  <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    Most popular
                  </span>
                )}
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="font-display text-lg font-bold uppercase">{s.code}</span>
                </div>
                <p className="mt-1 text-sm font-semibold text-foreground">{s.title}</p>
                <p className="mt-3 font-display text-3xl font-bold text-primary">
                  {s.perLesson}
                  <span className="text-sm font-semibold text-muted-foreground"> / lesson</span>
                </p>
                <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                  {s.bundles.map((b) => (
                    <li key={b.label} className="flex justify-between">
                      <span>{b.label}</span>
                      <span className="font-semibold text-foreground">{b.price}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant="dark" className="mt-6 w-full">
                  <Link to="/contact">Book {s.code}</Link>
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-start justify-between gap-4 rounded-xl border border-border bg-card p-6 shadow-card sm:flex-row sm:items-center">
            <div>
              <h3 className="font-display text-xl font-bold uppercase">{learnersLicence.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{learnersLicence.description}</p>
            </div>
            <div className="text-left sm:text-right">
              <p className="font-display text-3xl font-bold text-primary">
                {learnersLicence.price}
              </p>
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Study material + transport
              </p>
            </div>
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
              From booking to licence
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

      {/* Fleet / shuttle band */}
      <section className="relative overflow-hidden">
        <img
          src={fleetImg}
          alt="Driving school fleet and shuttle"
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
                Shuttle &amp; Transport Services
              </h2>
              <p className="mt-3 text-white/80">
                Safe, reliable transport to your lessons and test venue. Vehicle hire available for
                test day across all licence codes.
              </p>
              <Button asChild variant="hero" size="lg" className="mt-6">
                <Link to="/contact">Enquire about transport</Link>
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
              Trusted by our learners
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
            Ready to get on the road?
          </h2>
          <p className="max-w-xl text-white/90">
            Join now and lock in the opening special — the first 10 customers save R150–R200.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild variant="dark" size="xl">
              <Link to="/contact">Book a Lesson</Link>
            </Button>
            <Button asChild variant="outlineLight" size="xl">
              <Link to="/portal">Student Portal</Link>
            </Button>
          </div>
          <ul className="mt-2 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/90">
            {["No cash needed — pay online", "Flexible time slots", "Study material included"].map(
              (i) => (
                <li key={i} className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" /> {i}
                </li>
              ),
            )}
          </ul>
        </div>
      </section>
    </>
  );
}
