import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X, Phone } from "lucide-react";
import logo from "../assets/logo1.jpeg";
import { contactInfo } from "../data/site";
import { Button } from "../components/ui/button";

const nav = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "About", to: "/about" },
  { label: "Contact", to: "/contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex min-w-0 items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={logo}
            alt="Nthlakusani & Jama Driving School logo"
            className="h-10 w-10 shrink-0"
            width={40}
            height={40}
          />
          <div className="min-w-0 leading-tight">
            <p className="truncate font-display text-base font-bold uppercase tracking-tight text-foreground">
              Nthlakusani &amp; Jama
            </p>
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
              Driving School &amp; Shuttle
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-3 py-2 text-sm font-semibold text-foreground/80 transition-colors hover:bg-muted hover:text-foreground"
              activeProps={{ className: "text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button asChild variant="ghost" size="sm">
            <Link to="/auth">Sign In</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/contact">Book a Lesson</Link>
          </Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-border md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: item.to === "/" }}
                className="rounded-md px-3 py-2.5 text-sm font-semibold text-foreground/80 hover:bg-muted"
                activeProps={{ className: "text-primary" }}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Button asChild variant="outline" onClick={() => setOpen(false)}>
                <Link to="/auth">Sign In</Link>
              </Button>
              <Button asChild variant="hero" onClick={() => setOpen(false)}>
                <Link to="/contact">Book a Lesson</Link>
              </Button>
              <a
                href={`tel:${contactInfo.phones[0].tel}`}
                className="flex items-center justify-center gap-2 rounded-md bg-muted px-3 py-2.5 text-sm font-semibold"
              >
                <Phone className="h-4 w-4" /> {contactInfo.phones[0].number}
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
