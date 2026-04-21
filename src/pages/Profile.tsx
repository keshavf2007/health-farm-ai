import { useState } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Sprout, Mail, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Profile = () => {
  const [tab, setTab] = useState<"profile" | "signin">("profile");

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
              <h2 className="font-display text-2xl font-semibold">Aria Mendes</h2>
              <p className="text-muted-foreground text-sm">Greenfield Farm, Valley District</p>

              <div className="grid gap-4 sm:grid-cols-3 mt-6">
                {[
                  { icon: Sprout, l: "Crops grown", v: "12" },
                  { icon: MapPin, l: "Hectares", v: "48" },
                  { icon: User, l: "Member since", v: "2023" },
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
                  <span className="font-medium">aria@greenfield.farm</span>
                </div>
                <div className="flex justify-between p-3 rounded-2xl bg-secondary/40">
                  <span className="text-muted-foreground">Region</span>
                  <span className="font-medium">Mediterranean climate</span>
                </div>
                <div className="flex justify-between p-3 rounded-2xl bg-secondary/40">
                  <span className="text-muted-foreground">Primary crops</span>
                  <span className="font-medium">Tomato, Wheat, Pepper</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Auth */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl bg-gradient-card border border-border p-7 shadow-card h-fit lg:sticky lg:top-28">
          <div className="flex gap-1 p-1 rounded-full bg-secondary mb-6">
            <button
              onClick={() => setTab("signin")}
              className={cn("flex-1 py-2 rounded-full text-sm font-medium transition-colors", tab === "signin" ? "bg-background shadow-soft" : "text-muted-foreground")}
            >
              Sign in
            </button>
            <button
              onClick={() => setTab("profile")}
              className={cn("flex-1 py-2 rounded-full text-sm font-medium transition-colors", tab === "profile" ? "bg-background shadow-soft" : "text-muted-foreground")}
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

          <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
            {tab === "profile" && (
              <div>
                <label className="text-xs font-medium text-muted-foreground">Full name</label>
                <input type="text" placeholder="Aria Mendes" className="mt-1 w-full h-12 rounded-2xl bg-background border border-border px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
              </div>
            )}
            <div>
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="you@farm.com" className="w-full h-12 rounded-2xl bg-background border border-border pl-11 pr-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground">Password</label>
              <input type="password" placeholder="••••••••" className="mt-1 w-full h-12 rounded-2xl bg-background border border-border px-4 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition" />
            </div>
            <Button variant="hero" className="w-full" size="lg">
              {tab === "signin" ? <><LogIn /> Sign in</> : <><UserPlus /> Create account</>}
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
