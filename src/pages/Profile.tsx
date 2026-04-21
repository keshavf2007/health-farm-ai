import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { User, MapPin, Sprout, Mail, LogIn, UserPlus, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

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
            <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Your farm, your story.</h1>
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
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Welcome to AgroGuard.</h1>
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
            {tab === "signin" ? "Welcome back" : "Join AgroGuard"}
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

          <p className="text-xs text-muted-foreground text-center mt-5">
            By continuing you agree to our terms of service and privacy policy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
