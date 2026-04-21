import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Image as ImageIcon, Loader2, AlertTriangle, CheckCircle2, Droplets, Sprout, ShieldAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Result = {
  pest: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  treatment: string[];
  prevention: string[];
};

const mockResult: Result = {
  pest: "Tomato Late Blight",
  confidence: 94,
  severity: "high",
  description: "A fast-spreading fungal disease (Phytophthora infestans) that affects leaves, stems and fruit, especially in cool, wet conditions.",
  treatment: [
    "Remove and destroy infected leaves immediately to prevent spread.",
    "Apply copper-based fungicide every 7–10 days during humid periods.",
    "Improve air circulation by spacing plants and pruning lower foliage.",
  ],
  prevention: [
    "Water at the base of the plant — avoid wetting leaves.",
    "Rotate crops and avoid planting tomatoes in the same spot yearly.",
    "Use resistant varieties when available.",
  ],
};

const severityStyles = {
  low: { bg: "bg-success/10", text: "text-success", label: "Low Severity", icon: CheckCircle2 },
  medium: { bg: "bg-warning/15", text: "text-warning", label: "Moderate", icon: AlertTriangle },
  high: { bg: "bg-destructive/10", text: "text-destructive", label: "High Severity", icon: ShieldAlert },
};

const Detect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const analyze = () => {
    if (!file) return;
    setLoading(true);
    setTimeout(() => {
      setResult(mockResult);
      setLoading(false);
    }, 1800);
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  const sev = result ? severityStyles[result.severity] : null;

  return (
    <section className="container py-12 md:py-16">
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">Pest Detection</span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold text-balance">
          Diagnose your plants in seconds.
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Upload a clear photo of an affected leaf or fruit. Our AI will identify the issue and recommend a treatment plan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Upload */}
        <div className="lg:col-span-3">
          <div
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={cn(
              "relative rounded-3xl border-2 border-dashed transition-all p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center text-center bg-gradient-card",
              drag ? "border-primary bg-accent/40 scale-[1.01]" : "border-border hover:border-primary/40"
            )}
          >
            {preview ? (
              <div className="relative w-full">
                <img src={preview} alt="Uploaded plant" className="rounded-2xl w-full max-h-[360px] object-cover shadow-card" />
                <button
                  onClick={reset}
                  className="absolute top-3 right-3 h-9 w-9 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-background shadow-soft"
                  aria-label="Remove image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="h-20 w-20 rounded-3xl bg-gradient-primary flex items-center justify-center mb-6 shadow-elegant">
                  <Upload className="h-9 w-9 text-primary-foreground" />
                </div>
                <h3 className="font-display text-2xl font-semibold mb-2">Drop your plant photo here</h3>
                <p className="text-muted-foreground mb-6 max-w-sm">
                  PNG or JPG. For best results, use a well-lit close-up of the affected area.
                </p>
                <Button variant="hero" size="lg" onClick={() => inputRef.current?.click()}>
                  <ImageIcon /> Choose photo
                </Button>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
              </>
            )}
          </div>

          {preview && !result && (
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={reset}>Cancel</Button>
              <Button variant="hero" size="lg" onClick={analyze} disabled={loading}>
                {loading ? <><Loader2 className="animate-spin" /> Analyzing…</> : <>Analyze Plant</>}
              </Button>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-3xl bg-secondary/40 border border-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[420px]"
              >
                <Sprout className="h-12 w-12 text-primary/40 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Awaiting analysis</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Upload a photo and tap analyze to see results, severity and treatment recommendations.
                </p>
              </motion.div>
            )}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="rounded-3xl bg-card border border-border p-8 h-full flex flex-col items-center justify-center min-h-[420px]"
              >
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="font-medium">Analyzing your plant…</p>
                <p className="text-sm text-muted-foreground mt-1">Detecting patterns and symptoms</p>
              </motion.div>
            )}
            {result && sev && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="rounded-3xl bg-gradient-card border border-border shadow-card overflow-hidden"
              >
                <div className={cn("p-6 border-b border-border", sev.bg)}>
                  <div className="flex items-center gap-2 mb-2">
                    <sev.icon className={cn("h-4 w-4", sev.text)} />
                    <span className={cn("text-xs font-semibold uppercase tracking-wider", sev.text)}>{sev.label}</span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{result.pest}</h3>
                  <div className="mt-4 flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-background/60 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${result.confidence}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-gradient-primary rounded-full"
                      />
                    </div>
                    <span className="font-display text-lg font-semibold">{result.confidence}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">Confidence</p>
                </div>

                <div className="p-6 space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">{result.description}</p>

                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-3">
                      <Droplets className="h-4 w-4 text-primary" /> Recommended Treatment
                    </h4>
                    <ul className="space-y-2">
                      {result.treatment.map((t, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">{i + 1}</span>
                          <span className="text-muted-foreground">{t}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-3">
                      <ShieldAlert className="h-4 w-4 text-earth" /> Prevention
                    </h4>
                    <ul className="space-y-2">
                      {result.prevention.map((t, i) => (
                        <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button variant="hero" className="w-full" size="lg">Save to history</Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default Detect;
