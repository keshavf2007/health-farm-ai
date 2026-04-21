import { motion } from "framer-motion";
import { CloudSun, Droplets, Wind, Thermometer, Sprout, TrendingUp, TrendingDown, Bug, Leaf, AlertTriangle } from "lucide-react";
import { LineChart, Line, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, RadialBarChart, RadialBar, PolarAngleAxis } from "recharts";

const detectionTrend = [
  { m: "Jan", v: 4 }, { m: "Feb", v: 6 }, { m: "Mar", v: 9 }, { m: "Apr", v: 14 },
  { m: "May", v: 11 }, { m: "Jun", v: 18 }, { m: "Jul", v: 22 }, { m: "Aug", v: 16 },
  { m: "Sep", v: 12 }, { m: "Oct", v: 8 }, { m: "Nov", v: 5 }, { m: "Dec", v: 3 },
];

const npk = [
  { name: "Nitrogen", v: 78, fill: "hsl(var(--primary))" },
  { name: "Phosphorus", v: 62, fill: "hsl(var(--warning))" },
  { name: "Potassium", v: 84, fill: "hsl(var(--earth))" },
];

const pestBreakdown = [
  { name: "Aphids", v: 12 }, { name: "Blight", v: 8 }, { name: "Mites", v: 5 },
  { name: "Rust", v: 7 }, { name: "Wilt", v: 3 },
];

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className={`rounded-3xl bg-gradient-card border border-border p-6 shadow-soft ${className}`}
  >
    {children}
  </motion.div>
);

const Dashboard = () => {
  return (
    <section className="container py-10 md:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Farm Dashboard</span>
          <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Good morning, Farmer 🌾</h1>
          <p className="text-muted-foreground mt-2">Here's a snapshot of your fields today.</p>
        </div>
        <div className="flex gap-2">
          <span className="rounded-full bg-success/15 text-success px-4 py-1.5 text-sm font-medium">All systems healthy</span>
        </div>
      </div>

      {/* Top stats */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
        {[
          { icon: Thermometer, label: "Temperature", value: "27°C", trend: "+2°", color: "text-warning", bg: "bg-warning/10" },
          { icon: Droplets, label: "Humidity", value: "68%", trend: "Stable", color: "text-primary", bg: "bg-primary/10" },
          { icon: Wind, label: "Wind", value: "12 km/h", trend: "NE", color: "text-earth", bg: "bg-earth/10" },
          { icon: CloudSun, label: "Rain (24h)", value: "3.2 mm", trend: "Light", color: "text-soil", bg: "bg-accent" },
        ].map((s, i) => (
          <Card key={s.label}>
            <div className={`h-11 w-11 rounded-2xl ${s.bg} flex items-center justify-center mb-3`}>
              <s.icon className={`h-5 w-5 ${s.color}`} />
            </div>
            <div className="text-sm text-muted-foreground">{s.label}</div>
            <div className="font-display text-3xl font-semibold mt-1">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.trend}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Soil fertility */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-display text-xl font-semibold">Soil Fertility</h3>
              <p className="text-sm text-muted-foreground">pH 6.8 — Optimal range</p>
            </div>
            <Sprout className="h-5 w-5 text-primary" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart innerRadius="30%" outerRadius="100%" data={npk} startAngle={90} endAngle={-270}>
                  <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                  <RadialBar background dataKey="v" cornerRadius={20} />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {npk.map((n) => (
                <div key={n.name} className="flex items-center justify-between p-3 rounded-2xl bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ background: n.fill }} />
                    <span className="font-medium">{n.name}</span>
                  </div>
                  <span className="font-display text-lg font-semibold">{n.v}%</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground pt-2">
                💡 Phosphorus is slightly low. Consider applying bone meal or rock phosphate.
              </p>
            </div>
          </div>
        </Card>

        {/* Crop health */}
        <Card>
          <h3 className="font-display text-xl font-semibold mb-1">Crop Health</h3>
          <p className="text-sm text-muted-foreground mb-5">Based on recent detections</p>
          <div className="space-y-3">
            {[
              { c: "Tomatoes", v: 92, s: "Healthy", icon: Leaf, color: "text-success" },
              { c: "Wheat", v: 78, s: "Monitor", icon: AlertTriangle, color: "text-warning" },
              { c: "Corn", v: 88, s: "Healthy", icon: Leaf, color: "text-success" },
              { c: "Peppers", v: 64, s: "Action needed", icon: Bug, color: "text-destructive" },
            ].map((c) => (
              <div key={c.c} className="p-3 rounded-2xl bg-secondary/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{c.c}</span>
                  <span className={`flex items-center gap-1 text-xs ${c.color}`}>
                    <c.icon className="h-3.5 w-3.5" /> {c.s}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-background overflow-hidden">
                  <div className="h-full bg-gradient-primary rounded-full" style={{ width: `${c.v}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Detection trend */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display text-xl font-semibold">Pest Detections — 12 months</h3>
              <p className="text-sm text-muted-foreground">Seasonal pattern analysis</p>
            </div>
            <span className="flex items-center gap-1 text-xs text-success font-medium">
              <TrendingDown className="h-4 w-4" /> -18% vs last year
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={detectionTrend}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="m" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                <Line type="monotone" dataKey="v" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ fill: "hsl(var(--primary))", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top pests */}
        <Card>
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display text-xl font-semibold">Top Pests</h3>
            <TrendingUp className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pestBreakdown} layout="vertical" margin={{ left: 10 }}>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={70} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                <Bar dataKey="v" fill="hsl(var(--primary))" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
