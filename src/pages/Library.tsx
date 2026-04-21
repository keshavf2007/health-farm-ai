import { useState } from "react";
import { motion } from "framer-motion";
import { Search, Bug, AlertTriangle, ShieldCheck } from "lucide-react";

const pests = [
  { name: "Aphids", crops: "Most crops", severity: "Medium", symptom: "Curling leaves, sticky residue, stunted growth.", prevention: "Introduce ladybugs; spray neem oil weekly.", color: "from-warning/30 to-warning/5" },
  { name: "Late Blight", crops: "Tomato, Potato", severity: "High", symptom: "Brown lesions on leaves and fruit; white mold underneath.", prevention: "Improve airflow; copper fungicide; resistant cultivars.", color: "from-destructive/30 to-destructive/5" },
  { name: "Spider Mites", crops: "Beans, Tomato", severity: "Medium", symptom: "Stippled leaves, fine webbing on undersides.", prevention: "Increase humidity; release predatory mites.", color: "from-warning/30 to-warning/5" },
  { name: "Powdery Mildew", crops: "Cucurbits, Grapes", severity: "Medium", symptom: "White powdery patches on leaves and stems.", prevention: "Sun exposure; sulfur or potassium bicarbonate spray.", color: "from-warning/30 to-warning/5" },
  { name: "Leaf Rust", crops: "Wheat, Barley", severity: "High", symptom: "Orange-brown pustules on leaves; reduced yield.", prevention: "Plant resistant varieties; rotate crops.", color: "from-destructive/30 to-destructive/5" },
  { name: "Root Knot Nematode", crops: "Vegetables", severity: "High", symptom: "Galls on roots; wilting despite watering.", prevention: "Solarization; marigold cover crops.", color: "from-destructive/30 to-destructive/5" },
  { name: "Whitefly", crops: "Tomato, Cotton", severity: "Medium", symptom: "Tiny white insects under leaves; yellowing.", prevention: "Yellow sticky traps; insecticidal soap.", color: "from-warning/30 to-warning/5" },
  { name: "Cutworm", crops: "Seedlings", severity: "Low", symptom: "Stems cut at soil level overnight.", prevention: "Cardboard collars; till soil before planting.", color: "from-success/30 to-success/5" },
];

const Library = () => {
  const [q, setQ] = useState("");
  const filtered = pests.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()) || p.crops.toLowerCase().includes(q.toLowerCase()));

  return (
    <section className="container py-10 md:py-14">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Pest Library</span>
      <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Know your enemy.</h1>
      <p className="text-muted-foreground mt-2 mb-8 max-w-2xl">
        Browse a comprehensive database of common pests and diseases. Learn symptoms, causes and proven prevention techniques.
      </p>

      <div className="relative max-w-xl mb-10">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search pests, diseases or crops…"
          className="w-full rounded-full bg-card border border-border pl-14 pr-6 h-14 text-base focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-soft"
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p, i) => (
          <motion.article
            key={p.name}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className="group rounded-3xl bg-gradient-card border border-border overflow-hidden shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
          >
            <div className={`h-32 bg-gradient-to-br ${p.color} flex items-center justify-center relative`}>
              <Bug className="h-14 w-14 text-foreground/70 group-hover:scale-110 transition-transform" />
              <span className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full bg-background/80 backdrop-blur">
                {p.severity}
              </span>
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold">{p.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">Affects: {p.crops}</p>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-warning text-xs uppercase tracking-wider mb-1">
                    <AlertTriangle className="h-3 w-3" /> Symptoms
                  </div>
                  <p className="text-muted-foreground">{p.symptom}</p>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 font-semibold text-success text-xs uppercase tracking-wider mb-1">
                    <ShieldCheck className="h-3 w-3" /> Prevention
                  </div>
                  <p className="text-muted-foreground">{p.prevention}</p>
                </div>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">No pests match "{q}"</div>
      )}
    </section>
  );
};

export default Library;
