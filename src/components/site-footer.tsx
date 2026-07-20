import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin } from "lucide-react";
import logo from "../assets/logo1.jpeg";
import { contactInfo } from "../data/site";

export function SiteFooter() {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="h-11 w-11"
              width={44}
              height={44}
              loading="lazy"
            />
            <div className="leading-tight">
              <p className="font-display text-lg font-bold uppercase">Nthlakusani &amp; Jama</p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
                {contactInfo.since}
              </p>
            </div>
          </div>
          <p className="mt-4 max-w-xs text-sm text-secondary-foreground/70">
            Driving School &amp; Shuttle Services. Professional lessons, learner&apos;s licence
            prep, and safe transport.
          </p>
          <p className="mt-4 font-display text-xl font-bold text-primary">{contactInfo.tagline}</p>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-secondary-foreground/90">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
            <li>
              <Link to="/" className="hover:text-primary">
                Home
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-primary">
                Services &amp; Pricing
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-primary">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-primary">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/portal" className="hover:text-primary">
                Student / Instructor Portal
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-secondary-foreground/90">
            Contact
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
            {contactInfo.phones.map((p) => (
              <li key={p.tel} className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`tel:${p.tel}`} className="hover:text-primary">
                  <span className="block text-xs text-secondary-foreground/50">{p.label}</span>
                  {p.number}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-wide text-secondary-foreground/90">
            Email
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
            {contactInfo.emails.map((e) => (
              <li key={e} className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a href={`mailto:${e}`} className="break-all hover:text-primary">
                  {e}
                </a>
              </li>
            ))}
            <li className="flex items-start gap-2 pt-1">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>115 Paul Kruger(Regus Building), floor 2, office 220</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-secondary-foreground/50 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Nthlakusani &amp; Jama Driving School &amp; Shuttle Services.
          All rights reserved.
        </div>
      </div>
    </footer>
  );
}
