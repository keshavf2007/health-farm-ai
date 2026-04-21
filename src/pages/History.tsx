import { motion } from "framer-motion";
import { Bug, Leaf, Calendar, MapPin } from "lucide-react";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const seasonal = [
  { s: "Spring", v: 18 }, { s: "Summer", v: 32 }, { s: "Autumn", v: 14 }, { s: "Winter", v: 4 },
];

const records = [
  { d: "Apr 12", crop: "Tomato", pest: "Late Blight", sev: "High", field: "Field A" },
  { d: "Apr 08", crop: "Wheat", pest: "Leaf Rust", sev: "Medium", field: "Field B" },
  { d: "Mar 30", crop: "Pepper", pest: "Aphids", sev: "Low", field: "Field C" },
  { d: "Mar 22", crop: "Corn", pest: "Cutworm", sev: "Low", field: "Field D" },
  { d: "Mar 15", crop: "Tomato", pest: "Whitefly", sev: "Medium", field: "Field A" },
  { d: "Mar 02", crop: "Beans", pest: "Spider Mites", sev: "High", field: "Field E" },
];

const sevColor = { Low: "bg-success/15 text-success", Medium: "bg-warning/15 text-warning", High: "bg-destructive/15 text-destructive" };

const History = () => {
  return (
    <section className="container py-10 md:py-14">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">History</span>
      <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Your farm timeline.</h1>
      <p className="text-muted-foreground mt-2 mb-10">Past detections, seasonal trends and field-by-field records.</p>

      <div className="grid gap-5 lg:grid-cols-3 mb-8">
        {[
          { icon: Bug, l: "Total detections", v: "68", sub: "Last 12 months" },
          { icon: Leaf, l: "Healthy diagnoses", v: "412", sub: "All-time" },
          { icon: Calendar, l: "Active fields", v: "5", sub: "Currently monitored" },
        ].map((s) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-3xl bg-gradient-card border border-border p-6 shadow-soft"
          >
            <div className="h-11 w-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
              <s.icon className="h-5 w-5 text-primary" />
            </div>
            <div className="text-sm text-muted-foreground">{s.l}</div>
            <div className="font-display text-3xl font-semibold mt-1">{s.v}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-5">
        <div className="rounded-3xl bg-gradient-card border border-border p-6 shadow-soft lg:col-span-2">
          <h3 className="font-display text-xl font-semibold mb-1">Seasonal pattern</h3>
          <p className="text-sm text-muted-foreground mb-4">Detections by season</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={seasonal}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="s" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-3xl bg-gradient-card border border-border p-6 shadow-soft lg:col-span-3">
          <h3 className="font-display text-xl font-semibold mb-4">Recent detections</h3>
          <div className="divide-y divide-border">
            {records.map((r) => (
              <div key={r.d + r.pest} className="flex items-center gap-4 py-3">
                <div className="text-xs text-muted-foreground font-medium w-14">{r.d}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{r.pest}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                    <span>{r.crop}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {r.field}</span>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${sevColor[r.sev as keyof typeof sevColor]}`}>{r.sev}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default History;
