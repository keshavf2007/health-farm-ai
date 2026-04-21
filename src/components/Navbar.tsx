import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/detect", label: "Pest Detection" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/weather", label: "Weather" },
  { to: "/reminders", label: "Reminders" },
  { to: "/library", label: "Library" },
  { to: "/history", label: "History" },
  { to: "/profile", label: "Profile" },
];

export const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const isHome = pathname === "/";

  return (
    <header className={cn(
      "fixed top-0 inset-x-0 z-50 transition-all duration-500",
      isHome
        ? "bg-background/30 backdrop-blur-xl border-b border-background/20"
        : "bg-background/85 backdrop-blur-xl border-b border-border"
    )}>
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary shadow-elegant transition-transform group-hover:scale-110">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className={cn("font-display text-lg font-bold tracking-tight", isHome ? "text-primary-foreground" : "text-foreground")}>
              AgroGuard
            </span>
            <span className={cn("text-[10px] font-semibold tracking-[0.2em] uppercase", isHome ? "text-primary-foreground/70" : "text-primary")}>
              AI
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {links.slice(0, 7).map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 rounded-full text-sm font-medium transition-colors",
                  isHome
                    ? isActive
                      ? "bg-background/20 text-primary-foreground"
                      : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-background/10"
                    : isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <Button asChild variant={isHome ? "glass" : "outline"} size="sm">
            <Link to="/profile">Sign in</Link>
          </Button>
          <Button asChild variant="hero" size="sm">
            <Link to="/detect">Analyze Plant</Link>
          </Button>
        </div>

        <button
          className={cn(
            "lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full",
            isHome ? "bg-background/20 text-primary-foreground" : "bg-accent text-foreground"
          )}
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-background border-t border-border animate-fade-up">
          <nav className="container py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-2xl text-sm font-medium transition-colors",
                    isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground hover:bg-accent/50"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild variant="hero" className="mt-3">
              <Link to="/detect" onClick={() => setOpen(false)}>Analyze Plant</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};
