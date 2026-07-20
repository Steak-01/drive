import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation } from "@tanstack/react-query";
import { Phone, Mail, Tag, Send, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { contactInfo, services } from "../data/site";
import { submitInquiry } from "../lib/inquiries.functions";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Book — Nthlakusani & Jama Driving School" },
      {
        name: "description",
        content:
          "Contact Nthlakusani & Jama Driving School & Shuttle Services to book a lesson. Call 061 580 6437 or 083 268 7425.",
      },
      { property: "og:title", content: "Contact & Book — Nthlakusani & Jama Driving School" },
      {
        property: "og:description",
        content: "Book a lesson or enquire about transport and vehicle hire.",
      },
    ],
  }),
  component: Contact,
});

function Contact() {
  const [sent, setSent] = useState(false);
  const [service, setService] = useState("");
  const submit = useServerFn(submitInquiry);

  const mutation = useMutation({
    mutationFn: (input: {
      name: string;
      email: string;
      phone: string;
      service: string;
      message: string;
    }) => submit({ data: input }),
    onSuccess: () => setSent(true),
    onError: (e) => toast.error(e instanceof Error ? e.message : "Could not send message"),
  });

  return (
    <>
      <section className="bg-gradient-hero py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
            Contact &amp; Book
          </p>
          <h1 className="mt-2 font-display text-4xl font-bold uppercase sm:text-5xl">
            Let&apos;s get you driving
          </h1>
          <p className="mt-4 max-w-2xl text-white/80">
            Send us a message to book a lesson, request transport or ask a question. We&apos;ll get
            back to you quickly.
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[1fr_1.2fr] lg:px-8">
          {/* Contact details */}
          <div>
            <div className="rounded-xl border border-primary bg-accent/40 p-5">
              <div className="flex items-center gap-2 font-bold text-primary">
                <Tag className="h-5 w-5" /> Opening Special
              </div>
              <p className="mt-1 text-sm text-foreground">
                First 10 customers get <strong>R150–R200 OFF</strong>. Mention it when you contact
                us!
              </p>
            </div>

            <h2 className="mt-8 font-display text-2xl font-bold uppercase">Get in touch</h2>
            <ul className="mt-5 space-y-4">
              {contactInfo.phones.map((p) => (
                <li key={p.tel} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Phone className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">
                      {p.label}
                    </p>
                    <a href={`tel:${p.tel}`} className="font-semibold hover:text-primary">
                      {p.number}
                    </a>
                  </div>
                </li>
              ))}
              {contactInfo.emails.map((e) => (
                <li key={e} className="flex items-start gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-primary">
                    <Mail className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                    <a href={`mailto:${e}`} className="break-all font-semibold hover:text-primary">
                      {e}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-8 font-display text-2xl font-bold text-primary">
              {contactInfo.tagline}
            </p>
          </div>

          {/* Form */}
          <div className="rounded-xl border border-border bg-card p-6 shadow-card sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle2 className="h-14 w-14 text-primary" />
                <h3 className="mt-4 font-display text-2xl font-bold uppercase">Message received</h3>
                <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                  Thank you! Our team will contact you shortly to confirm your booking.
                </p>
                <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.currentTarget);
                  mutation.mutate({
                    name: String(fd.get("name") ?? ""),
                    email: String(fd.get("email") ?? ""),
                    phone: String(fd.get("phone") ?? ""),
                    service,
                    message: String(fd.get("message") ?? ""),
                  });
                }}
              >
                <h2 className="font-display text-2xl font-bold uppercase">Book a lesson</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" name="name" required maxLength={100} placeholder="Your name" />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      maxLength={20}
                      placeholder="0XX XXX XXXX"
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    maxLength={255}
                    placeholder="you@example.com"
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="service">Service of interest</Label>
                  <Select value={service} onValueChange={setService}>
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="learners">Learner&apos;s Licence</SelectItem>
                      {services.map((s) => (
                        <SelectItem key={s.code} value={s.code}>
                          {s.code} — {s.title}
                        </SelectItem>
                      ))}
                      <SelectItem value="transport">Shuttle / Transport</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={1000}
                    placeholder="Tell us your preferred days/times and any questions."
                  />
                </div>
                <Button type="submit" variant="hero" size="lg" disabled={mutation.isPending}>
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                    </>
                  ) : (
                    <>
                      Send message <Send className="h-4 w-4" />
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground">
                  By submitting you agree to be contacted about your enquiry.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
