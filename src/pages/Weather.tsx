import { motion } from "framer-motion";
import { Sun, Cloud, CloudRain, CloudSun, Wind, Droplets, Thermometer, Sunrise, Sunset } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer, XAxis, Tooltip } from "recharts";

const forecast = [
  { d: "Mon", icon: Sun, hi: 28, lo: 18, cond: "Sunny" },
  { d: "Tue", icon: CloudSun, hi: 26, lo: 17, cond: "Partly cloudy" },
  { d: "Wed", icon: CloudRain, hi: 22, lo: 16, cond: "Light rain" },
  { d: "Thu", icon: CloudRain, hi: 21, lo: 15, cond: "Showers" },
  { d: "Fri", icon: Cloud, hi: 24, lo: 16, cond: "Cloudy" },
  { d: "Sat", icon: Sun, hi: 27, lo: 18, cond: "Sunny" },
  { d: "Sun", icon: Sun, hi: 29, lo: 19, cond: "Hot" },
];

const hourly = Array.from({ length: 12 }, (_, i) => ({
  h: `${(i * 2).toString().padStart(2, "0")}:00`,
  t: 18 + Math.round(Math.sin(i / 2) * 6 + 4),
}));

const Weather = () => {
  return (
    <section className="container py-10 md:py-14">
      <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Weather</span>
      <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold">Field forecast</h1>
      <p className="text-muted-foreground mt-2 mb-10">Hyperlocal conditions for your farm location.</p>

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Current */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 rounded-3xl bg-gradient-primary p-8 text-primary-foreground shadow-elegant relative overflow-hidden"
        >
          <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-primary-foreground/10 blur-3xl" />
          <div className="relative">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm">Right now • Greenfield Farm</p>
                <div className="mt-2 flex items-end gap-3">
                  <span className="font-display text-7xl font-light leading-none">27°</span>
                  <span className="pb-2 text-primary-foreground/80">Sunny & breezy</span>
                </div>
              </div>
              <Sun className="h-20 w-20 text-warning animate-float" />
            </div>
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: Droplets, l: "Humidity", v: "68%" },
                { icon: Wind, l: "Wind", v: "12 km/h" },
                { icon: Thermometer, l: "Feels like", v: "29°" },
                { icon: CloudRain, l: "Rain today", v: "3.2 mm" },
              ].map((s) => (
                <div key={s.l} className="rounded-2xl bg-primary-foreground/10 backdrop-blur p-4">
                  <s.icon className="h-4 w-4 text-primary-foreground/80 mb-2" />
                  <div className="text-xs text-primary-foreground/70">{s.l}</div>
                  <div className="font-display text-xl font-semibold">{s.v}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Sun */}
        <div className="rounded-3xl bg-gradient-card border border-border p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold mb-5">Sun & day</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-warning/10">
              <Sunrise className="h-7 w-7 text-warning" />
              <div>
                <div className="text-xs text-muted-foreground">Sunrise</div>
                <div className="font-display text-xl font-semibold">06:12</div>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-earth/10">
              <Sunset className="h-7 w-7 text-earth" />
              <div>
                <div className="text-xs text-muted-foreground">Sunset</div>
                <div className="font-display text-xl font-semibold">19:48</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground p-4 rounded-2xl bg-secondary/50">
              ☀️ 13h 36m of daylight — great for growth.
            </div>
          </div>
        </div>

        {/* Hourly chart */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-card border border-border p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold mb-1">Next 24 hours</h3>
          <p className="text-sm text-muted-foreground mb-4">Temperature trend</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourly}>
                <defs>
                  <linearGradient id="temp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="h" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px" }} />
                <Area type="monotone" dataKey="t" stroke="hsl(var(--primary))" strokeWidth={3} fill="url(#temp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7 day */}
        <div className="lg:col-span-3 rounded-3xl bg-gradient-card border border-border p-6 shadow-soft">
          <h3 className="font-display text-xl font-semibold mb-5">7-day forecast</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {forecast.map((f) => (
              <div key={f.d} className="rounded-2xl bg-secondary/50 p-4 text-center hover:bg-accent transition-colors">
                <div className="text-sm font-semibold mb-2">{f.d}</div>
                <f.icon className="h-9 w-9 mx-auto text-primary mb-2" />
                <div className="text-xs text-muted-foreground mb-1">{f.cond}</div>
                <div className="font-display text-lg font-semibold">{f.hi}° <span className="text-muted-foreground font-normal">/ {f.lo}°</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Weather;
