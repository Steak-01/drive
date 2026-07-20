import { createFileRoute, Link } from "@tanstack/react-router";
import { ShieldCheck, Target, HeartHandshake, Award, CheckCircle2 } from "lucide-react";
import { Button } from "../components/ui/button";
import { contactInfo } from "../data/site";
import heroImg from "../assets/hero.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Nthlakusani & Jama Driving School" },
      {
        name: "description",
        content:
          "Nthlakusani & Jama Driving School & Shuttle Services — professional, patient instructors helping South Africans drive forward since 2026.",
      },
      { property: "og:title", content: "About Us — Nthlakusani & Jama Driving School" },
      {
        property: "og:description",
        content: "Professional driving school and shuttle services. We Drive You Forward!",
      },
    ],
  }),
  component: About,
});

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    text: "Defensive driving habits that last a lifetime, taught from day one.",
  },
  {
    icon: Target,
    title: "Results Driven",
    text: "Structured lessons and progress tracking built around passing your test.",
  },
  {
    icon: HeartHandshake,
    title: "Patient & Inclusive",
    text: "Welcoming instructors for nervous beginners and learners of all ages.",
  },
  {
    icon: Award,
    title: "Professional Standards",
    text: "Certified instructors, roadworthy vehicles and reliable service.",
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
            About Our School
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            {contactInfo.name} is committed to creating safe, confident drivers across South Africa
            through professional instruction and reliable shuttle services.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 className="font-display text-3xl font-bold uppercase">We Drive You Forward</h2>
            <p className="mt-4 text-muted-foreground">
              Whether you&apos;re booking your first learner&apos;s licence or upgrading to a
              heavy-vehicle code, our mission is simple: equip every student with the skills,
              confidence and support to pass and stay safe on the road.
            </p>
            <p className="mt-4 text-muted-foreground">
              We cover Code 1, 8, 10 and 14 licences, learner&apos;s licence preparation with full
              study material, and shuttle transport to lessons and tests. Our secure online platform
              lets you book lessons, track your progress and pay without carrying cash.
            </p>
            <ul className="mt-6 grid gap-2 sm:grid-cols-2">
              {[
                "Certified instructors",
                "Roadworthy vehicles",
                "Online booking & payments",
                "Progress tracking",
                "Study guides & practice tests",
                "Shuttle & transport",
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
          <img
            src={heroImg}
            alt="Instructor and learner in a driving lesson"
            className="aspect-[4/3] w-full rounded-xl object-cover shadow-strong"
            width={1600}
            height={1100}
            loading="lazy"
          />
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
