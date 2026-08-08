import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, Sprout, Mail, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Seo } from "@/components/Seo";

type Profile = {
  display_name: string | null;
  farm_name: string | null;
  region: string | null;
};

const Profile = () => {
  const [tab, setTab] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  useEffect(() => {
    if (!user) {
      setProfile(null);
      return;
    }
    supabase
      .from("profiles")
      .select("display_name, farm_name, region")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setProfile(data));
  }, [user]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
    navigate(from, { replace: true });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: { display_name: name || email.split("@")[0] },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! You're signed in.");
    navigate(from, { replace: true });
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error.message ?? "Google sign-in failed");
      return;
    }
    if (result.redirected) {
      // Browser is redirecting to Google; stop here.
      return;
    }
    toast.success("Welcome!");
    navigate(from, { replace: true });
  };

  if (loading) {
    return (
      <section className="container py-20 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </section>
    );
  }

  // Logged in view
  if (user) {
    const displayName = profile?.display_name || user.email?.split("@")[0] || "Farmer";
    return (
      <section className="container py-10 md:py-14">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Profile</span>
            <Seo title="Your Farm Profile | HealthFarm AI" description="Manage your HealthFarm AI account, farm details and crops, and track your personalized plant health journey." path="/profile" noindex />
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Your Farm Profile</h1>
            <p className="text-muted-foreground mt-2 mb-8">Personalize your experience and track your growing journey.</p>

            <div className="rounded-3xl bg-gradient-card border border-border shadow-soft overflow-hidden">
              <div className="h-32 bg-gradient-primary relative">
                <div className="absolute -bottom-10 left-8 h-20 w-20 rounded-full bg-background border-4 border-background flex items-center justify-center shadow-elegant">
                  <User className="h-10 w-10 text-primary" />
                </div>
              </div>
              <div className="pt-14 px-8 pb-8">
                <h2 className="font-display text-2xl font-semibold capitalize">{displayName}</h2>
                <p className="text-muted-foreground text-sm">
                  {profile?.farm_name || "Add your farm name"}
                  {profile?.region ? `, ${profile.region}` : ""}
                </p>

                <div className="grid gap-4 sm:grid-cols-3 mt-6">
                  {[
                    { icon: Sprout, l: "Crops grown", v: "—" },
                    { icon: MapPin, l: "Hectares", v: "—" },
                    { icon: User, l: "Member since", v: new Date(user.created_at).getFullYear().toString() },
                  ].map((s) => (
                    <div key={s.l} className="rounded-2xl bg-secondary/50 p-4">
                      <s.icon className="h-4 w-4 text-primary mb-2" />
                      <div className="text-xs text-muted-foreground">{s.l}</div>
                      <div className="font-display text-xl font-semibold">{s.v}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2 text-sm">
                  <div className="flex justify-between p-3 rounded-2xl bg-secondary/40">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-2xl bg-secondary/40">
                    <span className="text-muted-foreground">Region</span>
                    <span className="font-medium">{profile?.region || "Not set"}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-2xl bg-secondary/40">
                    <span className="text-muted-foreground">Farm</span>
                    <span className="font-medium">{profile?.farm_name || "Not set"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-3xl bg-gradient-card border border-border p-7 shadow-card h-fit lg:sticky lg:top-28"
          >
            <h3 className="font-display text-2xl font-semibold mb-1">Account</h3>
            <p className="text-sm text-muted-foreground mb-6">Manage your session and preferences.</p>
            <Button variant="hero" className="w-full mb-3" onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </Button>
            <Button variant="outline" className="w-full" onClick={async () => { await signOut(); toast.success("Signed out"); }}>
              <LogOut /> Sign out
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  // Auth forms
  return (
    <section className="container py-10 md:py-14">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Profile</span>
          <Seo title="Sign In to HealthFarm AI | Smart Farming Account" description="Sign in or create a free HealthFarm AI account to access your farm dashboard, detection history and smart crop reminders." path="/profile" />
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Welcome to HealthFarm AI</h1>
          <p className="text-muted-foreground mt-2 mb-8">
            Sign in to access your personalized dashboard, track detections, and get smart reminders.
          </p>

          <div className="rounded-3xl bg-gradient-card border border-border p-8 shadow-soft">
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Sprout, t: "Track crops", d: "Save detections to your history." },
                { icon: MapPin, t: "Local insights", d: "Forecasts tailored to your region." },
                { icon: User, t: "Personal profile", d: "Your farm, your data." },
              ].map((f) => (
                <div key={f.t} className="rounded-2xl bg-secondary/40 p-4">
                  <f.icon className="h-5 w-5 text-primary mb-2" />
                  <div className="font-semibold text-sm">{f.t}</div>
                  <div className="text-xs text-muted-foreground mt-1">{f.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-3xl bg-gradient-card border border-border p-7 shadow-card h-fit lg:sticky lg:top-28"
        >
          <div className="flex gap-1 p-1 rounded-full bg-secondary mb-6">
            <button
              onClick={() => setTab("signin")}
              className={cn("flex-1 py-2 rounded-full text-sm font-medium transition-colors", tab === "signin" ? "bg-background shadow-soft" : "text-muted-foreground")}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab("signup")}
              className={cn("flex-1 py-2 rounded-full text-sm font-medium transition-colors", tab === "signup" ? "bg-background shadow-soft" : "text-muted-foreground")}
            >
              Sign up
            </button>
          </div>

          <h3 className="font-display text-2xl font-semibold mb-1">
            {tab === "signin" ? "Welcome back" : "Join HealthFarm"}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {tab === "signin" ? "Sign in to access your dashboard." : "Create a free account to get started."}
          </p>

          <form className="space-y-3" onSubmit={tab === "signin" ? handleSignIn : handleSignUp}>
            {tab === "signup" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aria Mendes"
                  className="mt-1 w-full h-12 rounded-2xl bg-background border border-border px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@farm.com"
                  className="w-full h-12 rounded-2xl bg-background border border-border pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 w-full h-12 rounded-2xl bg-background border border-border px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition"
              />
            </div>
            <Button type="submit" variant="hero" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <><Loader2 className="animate-spin" /> Please wait…</>
              ) : tab === "signin" ? (
                <><LogIn /> Sign in</>
              ) : (
                <><UserPlus /> Create account</>
              )}
            </Button>
          </form>

          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-gradient-card px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            size="lg"
            onClick={handleGoogleSignIn}
            disabled={submitting}
          >
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-5">
            By continuing you agree to our terms of service and privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
