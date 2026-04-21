import { useState } from "react";
import { motion } from "framer-motion";
import { Droplets, Sprout, Bug, Plus, Bell, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Reminder = { id: number; type: "water" | "fertilizer" | "pest"; title: string; when: string; field: string; done: boolean };

const initial: Reminder[] = [
  { id: 1, type: "water", title: "Drip irrigation — Tomato field", when: "Today, 17:00", field: "Field A", done: false },
  { id: 2, type: "fertilizer", title: "Apply NPK 10-10-10 to wheat", when: "Tomorrow, 08:00", field: "Field B", done: false },
  { id: 3, type: "pest", title: "Neem oil spray — Pepper rows", when: "Wed, 06:30", field: "Field C", done: false },
  { id: 4, type: "water", title: "Soak corn furrows", when: "Thu, 18:00", field: "Field D", done: true },
];

const styles = {
  water: { icon: Droplets, color: "text-primary", bg: "bg-primary/10", label: "Water" },
  fertilizer: { icon: Sprout, color: "text-earth", bg: "bg-earth/10", label: "Fertilizer" },
  pest: { icon: Bug, color: "text-destructive", bg: "bg-destructive/10", label: "Pest control" },
};

const Reminders = () => {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState<"all" | "water" | "fertilizer" | "pest">("all");

  const toggle = (id: number) => setItems((p) => p.map((r) => (r.id === id ? { ...r, done: !r.done } : r)));
  const filtered = filter === "all" ? items : items.filter((r) => r.type === filter);

  return (
    <section className="container py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Reminders</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Never miss a treatment.</h1>
          <p className="text-muted-foreground mt-2">Schedule water, fertilizer and pest control tasks across your fields.</p>
        </div>
        <Button variant="hero" size="lg"><Plus /> New reminder</Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {(["all", "water", "fertilizer", "pest"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium capitalize transition-all",
              filter === f ? "bg-primary text-primary-foreground shadow-soft" : "bg-secondary text-muted-foreground hover:bg-accent"
            )}
          >
            {f === "all" ? "All" : styles[f].label}
          </button>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((r, i) => {
          const s = styles[r.type];
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "rounded-3xl border border-border bg-gradient-card p-5 flex items-center gap-4 shadow-soft transition-all",
                r.done && "opacity-60"
              )}
            >
              <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center shrink-0", s.bg)}>
                <s.icon className={cn("h-6 w-6", s.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs font-semibold uppercase tracking-wider", s.color)}>{s.label}</span>
                  <span className="text-xs text-muted-foreground">• {r.field}</span>
                </div>
                <h3 className={cn("font-semibold truncate", r.done && "line-through")}>{r.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5" /> {r.when}
                </div>
              </div>
              <Button
                size="icon"
                variant={r.done ? "default" : "outline"}
                onClick={() => toggle(r.id)}
                aria-label="Mark done"
              >
                <Check className="h-4 w-4" />
              </Button>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-10 rounded-3xl bg-accent/50 border border-border p-6 flex items-start gap-4">
        <Bell className="h-6 w-6 text-primary shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold mb-1">Smart notifications</h3>
          <p className="text-sm text-muted-foreground">
            We adjust your reminders based on the weather forecast — no need to water before rain.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Reminders;
