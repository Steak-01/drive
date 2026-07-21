import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Clock, HeartHandshake, Award, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { contactInfo } from "../data/site";
import heroImg from "../assets/hero.jpg";
import logoBadge from "../assets/logo-badge.png";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — NJ Shuttle Services" },
      {
        name: "description",
        content:
          "NJ Shuttle Services — reliable airport transfers, corporate shuttles and inter-city transport across South Africa. Kings of Comfort, Choose Wisely.",
      },
      { property: "og:title", content: "About Us — NJ Shuttle Services" },
      {
        property: "og:description",
        content: "Professional shuttle transport across South Africa. Kings of Comfort, Choose Wisely.",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    text: "Vetted, background-checked drivers and roadworthy vehicles on every route.",
  },
  {
    icon: Clock,
    title: "On Time, Every Time",
    text: "Live tracking and realistic ETAs, so you're never left guessing when your ride will arrive.",
  },
  {
    icon: HeartHandshake,
    title: "Comfort & Care",
    text: "Friendly, professional drivers and a smooth ride, from a solo airport run to a full group booking.",
  },
  {
    icon: Award,
    title: "Professional Standards",
    text: "Licensed drivers, insured vehicles and dependable service you can build a schedule around.",
  },
];

function About() {
  return (
    <>
      <section className="bg-gradient-hero py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            {contactInfo.since}
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase sm:text-5xl">
            About NJ Shuttle Services
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            {contactInfo.name} is committed to getting you where you need to be — safely, on time
            and in comfort — with professional drivers and a fleet you can trust.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase">
              Kings of Comfort, Choose Wisely
            </h2>
            <p className="mt-4 text-muted-foreground">
              Whether you&apos;re catching an early flight, moving a team across the city, or
              getting a wedding party where it needs to be, our mission is simple: get every
              passenger there safely, on time and in comfort.
            </p>
            <p className="mt-4 text-muted-foreground">
              We run airport transfers, corporate shuttles, event transport and inter-city routes
              across South Africa. Our secure online platform lets you book a ride, track your
              driver live and pay without carrying cash.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Vetted, professional drivers",
                "Roadworthy, comfortable vehicles",
                "Online booking & payments",
                "Live ride tracking",
                "Fixed route pricing",
                "24/7 airport transfers",
              ].map((i) => (
                <li key={i} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-primary" /> {i}
                </li>
              ))}
            </ul>
            <Button asChild variant="hero" size="lg" className="mt-8">
              <Link to="/services">Explore our services</Link>
            </Button>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-strong">
            <img
              src={heroImg}
              alt="NJ Shuttle Services vehicle and driver"
              className="h-full w-full object-cover"
              width={1600}
              height={1100}
              loading="lazy"
            />
            <img
              src={logoBadge}
              alt="NJ Shuttle Services badge"
              className="absolute bottom-4 right-4 h-16 w-16 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.45)] ring-2 ring-white/90 sm:h-20 sm:w-20"
            />
          </div>
        </div>
      </section>

      <section className="section-pad bg-muted/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Our values</p>
            <h2 className="mt-2 font-display text-3xl font-bold uppercase sm:text-4xl">
              What we stand for
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-border bg-card p-6 shadow-card"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent">
                  <v.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold uppercase">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}