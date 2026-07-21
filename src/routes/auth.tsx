import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { supabase } from "../integrations/supabase/client";
import { bootstrapAccount, getMyAccount } from "../lib/account.functions";
import { homeForRoles } from "../hooks/use-account";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import logo from "../assets/logo-b.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign In — Nthlakusani & Jama Driving School" },
      {
        name: "description",
        content:
          "Sign in or create your account to book driving lessons, track progress and manage your bookings.",
      },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function redirectIfAuthenticated() {
      const { data } = await supabase.auth.getUser();
      if (!data.user || !active) return;

      try {
        const account = await getMyAccount();
        if (!active) return;
        navigate({ to: homeForRoles(account.roles), replace: true });
      } catch (err) {
        console.error("getMyAccount failed:", err);
      }
    }

    redirectIfAuthenticated();
    return () => {
      active = false;
    };
  }, [navigate]);

  async function afterAuth() {
    try {
      await bootstrapAccount({
        fullName: fullName || undefined,
        phone: phone || undefined,
      });
    } catch {
      /* non-fatal — dashboard retries bootstrap */
    }

    try {
      const account = await getMyAccount();
      navigate({ to: homeForRoles(account.roles), replace: true });
    } catch {
      navigate({ to: "/dashboard", replace: true });
    }
  }

  function friendlyError(message: string): string {
    const m = message.toLowerCase();
    if (m.includes("invalid login credentials"))
      return "Incorrect email or password. Please try again.";
    if (m.includes("already registered") || m.includes("already exists"))
      return "An account with this email already exists. Try signing in instead.";
    if (m.includes("email not confirmed"))
      return "Please confirm your email address before signing in.";
    if (m.includes("password") && m.includes("6")) return "Password must be at least 6 characters.";
    return message || "Authentication failed. Please try again.";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;

        if (data.session) {
          // Email confirmation is disabled on this project, so signUp already
          // returned an active session — safe to bootstrap and continue.
          toast.success("Account created!");
          await afterAuth();
        } else {
         
          toast.success("Account created! Check your email to confirm it, then sign in.");
          setMode("signin");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        await afterAuth();
      }
    } catch (err) {
      const msg = friendlyError(err instanceof Error ? err.message : "");
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        setErrorMsg("Google sign-in failed. Please try again.");
        toast.error("Google sign-in failed. Please try again.");
        setLoading(false);
        return;
      }

      // No need to setLoading(false) here.
      // The browser will redirect to Google if there is no error.
    } catch (err) {
      setErrorMsg("Google sign-in failed. Please try again.");
      toast.error("Google sign-in failed.");
      setLoading(false);
    }
  }

  return (
    <section className="section-pad">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>

        <div className="rounded-xl border border-border bg-card p-7 shadow-card">
          <div className="flex flex-col items-center text-center">
            <img
            src={logo}
            alt="Nthlakusani & Jama Driving School logo"
            className="h-10 w-10 shrink-0 rounded-full object-cover border-2 border-primary"
            width={40}
            height={40}
          />
            <h1 className="mt-3 font-display text-2xl font-bold uppercase">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {mode === "signin"
                ? "Access your dashboard and bookings."
                : "Join us and book your first lesson."}
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="mt-6 w-full"
            onClick={handleGoogle}
            disabled={loading}
          >
            <GoogleIcon /> Continue with Google
          </Button>

          {errorMsg && (
            <div
              role="alert"
              className="mt-6 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive"
            >
              {errorMsg}
            </div>
          )}

          <div className="my-5 flex items-center gap-3 text-xs uppercase tracking-wide text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <>
                <div className="space-y-1.5">
                  <Label htmlFor="fullName">Full name</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Thabo Mokoena"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="061 580 6437"
                    type="tel"
                  />
                </div>
              </>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={6}
                required
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <p className="mt-5 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "No account yet?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setErrorMsg(null);
                setMode(mode === "signin" ? "signup" : "signin");
              }}
              className="font-semibold text-primary hover:underline"
            >
              {mode === "signin" ? "Create one" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}