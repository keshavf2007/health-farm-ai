import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Bug, CloudSun, Bell, BookOpen, BarChart3, Leaf, Sprout, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-farmland.jpg";

const features = [
  { icon: Bug, title: "AI Pest Detection", desc: "Snap a photo and get instant disease identification with treatment plans.", color: "text-destructive" },
  { icon: Sprout, title: "Soil Fertility", desc: "Monitor pH, NPK levels and receive personalized improvement suggestions.", color: "text-primary" },
  { icon: CloudSun, title: "Weather Forecast", desc: "Hyperlocal weather, humidity and rainfall predictions for your farm.", color: "text-warning" },
  { icon: Bell, title: "Smart Reminders", desc: "Watering, fertilizer and pest control alerts right when you need them.", color: "text-earth" },
  { icon: BookOpen, title: "Pest Library", desc: "Searchable database of pests and diseases with prevention guides.", color: "text-soil" },
  { icon: BarChart3, title: "History & Trends", desc: "Track seasonal patterns to plan smarter for the next season.", color: "text-primary" },
];

const steps = [
  { n: "01", title: "Upload a photo", desc: "Drag & drop or snap a picture of the affected leaf or crop." },
  { n: "02", title: "AI analyzes instantly", desc: "Our model identifies pests, diseases and severity in seconds." },
  { n: "03", title: "Act with confidence", desc: "Get tailored treatment, prevention tips and reminders." },
];

const Home = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[100svh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Aerial view of lush farmland at golden hour"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero" style={{ backgroundImage: 'var(--gradient-hero)' }} />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
        </div>

        <div className="container relative z-10 pt-32 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-background/15 backdrop-blur-md border border-background/30 px-4 py-1.5 text-xs font-medium text-primary-foreground mb-6">
              <Leaf className="h-3.5 w-3.5" />
              Smart farming, powered by AI
            </span>
            <h1 className="font-display text-5xl md:text-7xl lg:text-[5.5rem] leading-[0.95] font-semibold text-primary-foreground text-balance">
              Empowering farmers with{" "}
              <em className="italic font-light text-primary-glow">AI-driven</em> insights
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-foreground/85 max-w-2xl leading-relaxed">
              Detect pests, monitor soil health and plan irrigation — all from one beautiful dashboard built for the modern farmer.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild variant="hero" size="xl">
                <Link to="/detect">
                  Analyze Plant <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 max-w-xl">
              {[
                { v: "98.2%", l: "Detection accuracy" },
                { v: "120+", l: "Pests covered" },
                { v: "24/7", l: "Field monitoring" },
              ].map((s) => (
                <div key={s.l}>
                  <div className="font-display text-3xl md:text-4xl font-semibold text-primary-foreground">{s.v}</div>
                  <div className="text-xs md:text-sm text-primary-foreground/70 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 md:py-32 bg-gradient-soft">
        <div className="container">
          <div className="max-w-2xl mb-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Features</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-balance">
              Everything your farm needs, in one place.
            </h2>
            <p className="mt-4 text-muted-foreground text-lg">
              From early disease detection to seasonal trend analysis — AgroGuard AI brings precision agriculture to every grower.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group rounded-3xl bg-gradient-card border border-border p-7 shadow-soft hover:shadow-card transition-all hover:-translate-y-1"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 md:py-32">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">How it works</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl font-semibold text-balance">
              From leaf to insight in three steps.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative rounded-3xl bg-card border border-border p-8 shadow-soft"
              >
                <div className="font-display text-6xl font-light text-primary/15 mb-4">{s.n}</div>
                <h3 className="font-display text-2xl font-semibold mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="container">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-primary p-10 md:p-16 shadow-elegant">
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-primary-glow/30 blur-3xl" />
            <div className="absolute -left-10 -bottom-20 h-60 w-60 rounded-full bg-primary-foreground/10 blur-3xl" />
            <div className="relative max-w-2xl">
              <ShieldCheck className="h-10 w-10 text-primary-foreground/90 mb-5" />
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-primary-foreground text-balance">
                Protect your harvest before it's too late.
              </h2>
              <p className="mt-4 text-primary-foreground/85 text-lg">
                Join thousands of growers using AgroGuard AI to make every field more productive and resilient.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild variant="glass" size="lg">
                  <Link to="/detect">Try Detection <ArrowRight /></Link>
                </Button>
                <Button asChild size="lg" className="bg-background text-foreground hover:bg-background/90">
                  <Link to="/profile">Create free account</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
