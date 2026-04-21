import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  CheckCircle2,
  Droplets,
  Sprout,
  ShieldAlert,
  X,
  Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Prediction = {
  pest: string;
  confidence: number;
  severity: "low" | "medium" | "high";
  description: string;
  treatment: string[];
  prevention: string[];
};

type DiagnosisResponse = {
  requestId: string;
  plant: string;
  image_quality: "good" | "acceptable" | "poor";
  predictions: Prediction[];
};

const severityStyles = {
  low: { bg: "bg-success/10", text: "text-success", label: "Low Severity", icon: CheckCircle2 },
  medium: { bg: "bg-warning/15", text: "text-warning", label: "Moderate", icon: AlertTriangle },
  high: { bg: "bg-destructive/10", text: "text-destructive", label: "High Severity", icon: ShieldAlert },
} as const;

// Downscale + re-encode the image so the upload stays small AND a brand new
// base64 payload is produced for every file (kills any caching at every layer).
async function fileToCompressedBase64(
  file: File,
  maxDim = 1024,
): Promise<{ base64: string; mimeType: string }> {
  const dataUrl: string = await new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const i = new Image();
    i.onload = () => resolve(i);
    i.onerror = reject;
    i.src = dataUrl;
  });

  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);

  const out = canvas.toDataURL("image/jpeg", 0.85);
  const base64 = out.split(",")[1] ?? "";
  return { base64, mimeType: "image/jpeg" };
}

const Detect = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DiagnosisResponse | null>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setData(null);
    setActiveIdx(0);
    // Reset the input value so re-selecting the SAME file still triggers onChange
    if (inputRef.current) inputRef.current.value = "";
  };

  const analyze = async () => {
    if (!file) return;
    setLoading(true);
    setData(null);
    try {
      const { base64, mimeType } = await fileToCompressedBase64(file);
      console.log("[detect] sending image", {
        fileName: file.name,
        fileSize: file.size,
        compressedBytes: Math.round((base64.length * 3) / 4),
        mimeType,
      });

      const { data: resp, error } = await supabase.functions.invoke<DiagnosisResponse>(
        "detect-pest",
        {
          body: {
            imageBase64: base64,
            mimeType,
            fileName: file.name,
            fileSize: file.size,
            // Force-fresh marker (also helps log correlation)
            ts: Date.now(),
          },
        },
      );

      if (error) throw error;
      if (!resp?.predictions?.length) throw new Error("No predictions returned");

      console.log("[detect] received", resp);
      setData(resp);
      setActiveIdx(0);
    } catch (e: any) {
      console.error("[detect] failed", e);
      toast.error(e?.message ?? "Failed to analyze image");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setPreview(null);
    setData(null);
    setActiveIdx(0);
  };

  const active = data?.predictions[activeIdx];
  const sev = active ? severityStyles[active.severity] : null;

  return (
    <section className="container py-12 md:py-16">
      <div className="max-w-3xl mb-10">
        <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary">
          Pest Detection
        </span>
        <h1 className="mt-2 font-display text-4xl md:text-5xl font-semibold text-balance">
          Diagnose your plants in seconds.
        </h1>
        <p className="mt-3 text-muted-foreground text-lg">
          Upload a clear photo of an affected leaf or fruit. Our AI ranks the top 3 likely
          diagnoses with confidence scores and a treatment plan.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        {/* Upload */}
        <div className="lg:col-span-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDrag(true);
            }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFile(f);
            }}
            className={cn(
              "relative rounded-3xl border-2 border-dashed transition-all p-8 md:p-12 min-h-[420px] flex flex-col items-center justify-center text-center bg-gradient-card",
              drag ? "border-primary bg-accent/40 scale-[1.01]" : "border-border hover:border-primary/40",
            )}
          >
            {preview ? (
              <div className="relative w-full">
                <img
                  src={preview}
                  alt="Uploaded plant"
                  className="rounded-2xl w-full max-h-[360px] object-cover shadow-card"
                />
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
                <h3 className="font-display text-2xl font-semibold mb-2">
                  Drop your plant photo here
                </h3>
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

          {preview && !data && (
            <div className="mt-5 flex justify-end gap-3">
              <Button variant="outline" onClick={reset}>
                Cancel
              </Button>
              <Button variant="hero" size="lg" onClick={analyze} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" /> Analyzing…
                  </>
                ) : (
                  <>Analyze Plant</>
                )}
              </Button>
            </div>
          )}

          {data && (
            <div className="mt-5 flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>
                Detected plant: <span className="text-foreground font-medium">{data.plant}</span>
                {" · "}Image quality:{" "}
                <span className="text-foreground font-medium capitalize">{data.image_quality}</span>
              </span>
              <Button variant="outline" size="sm" onClick={reset}>
                New scan
              </Button>
            </div>
          )}
        </div>

        {/* Result */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!data && !loading && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl bg-secondary/40 border border-border p-8 h-full flex flex-col items-center justify-center text-center min-h-[420px]"
              >
                <Sprout className="h-12 w-12 text-primary/40 mb-4" />
                <h3 className="font-display text-xl font-semibold mb-2">Awaiting analysis</h3>
                <p className="text-muted-foreground text-sm max-w-xs">
                  Upload a photo and tap analyze to see ranked diagnoses, severity and treatment.
                </p>
              </motion.div>
            )}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl bg-card border border-border p-8 h-full flex flex-col items-center justify-center min-h-[420px]"
              >
                <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                <p className="font-medium">Analyzing your plant…</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Detecting patterns and symptoms
                </p>
              </motion.div>
            )}
            {data && active && sev && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="rounded-3xl bg-gradient-card border border-border shadow-card overflow-hidden"
              >
                {/* Top 3 chips */}
                <div className="p-4 border-b border-border bg-background/40">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-primary" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Top {data.predictions.length} predictions
                    </span>
                  </div>
                  <div className="space-y-2">
                    {data.predictions.map((p, i) => {
                      const isActive = i === activeIdx;
                      const isTop = i === 0;
                      return (
                        <button
                          key={i}
                          onClick={() => setActiveIdx(i)}
                          className={cn(
                            "w-full text-left rounded-xl border px-3 py-2 transition-all",
                            isActive
                              ? "border-primary bg-primary/5 shadow-soft"
                              : "border-border hover:border-primary/40 bg-background/60",
                          )}
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2 min-w-0">
                              <span
                                className={cn(
                                  "h-6 w-6 shrink-0 rounded-full flex items-center justify-center text-xs font-semibold",
                                  isTop
                                    ? "bg-gradient-primary text-primary-foreground"
                                    : "bg-muted text-muted-foreground",
                                )}
                              >
                                {i + 1}
                              </span>
                              <span className="font-medium truncate">{p.pest}</span>
                            </div>
                            <span className="font-display text-sm font-semibold tabular-nums">
                              {Math.round(p.confidence)}%
                            </span>
                          </div>
                          <div className="mt-2 h-1.5 rounded-full bg-background overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${p.confidence}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={cn(
                                "h-full rounded-full",
                                isTop ? "bg-gradient-primary" : "bg-muted-foreground/40",
                              )}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Active detail */}
                <div className={cn("p-6 border-b border-border", sev.bg)}>
                  <div className="flex items-center gap-2 mb-2">
                    <sev.icon className={cn("h-4 w-4", sev.text)} />
                    <span
                      className={cn(
                        "text-xs font-semibold uppercase tracking-wider",
                        sev.text,
                      )}
                    >
                      {sev.label}
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-semibold">{active.pest}</h3>
                </div>

                <div className="p-6 space-y-5">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {active.description}
                  </p>

                  <div>
                    <h4 className="flex items-center gap-2 font-semibold mb-3">
                      <Droplets className="h-4 w-4 text-primary" /> Recommended Treatment
                    </h4>
                    <ul className="space-y-2">
                      {active.treatment.map((t, i) => (
                        <li key={i} className="flex gap-3 text-sm">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary text-xs font-semibold">
                            {i + 1}
                          </span>
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
                      {active.prevention.map((t, i) => (
                        <li
                          key={i}
                          className="flex gap-2 text-sm text-muted-foreground"
                        >
                          <CheckCircle2 className="h-4 w-4 text-success shrink-0 mt-0.5" />
                          {t}
                        </li>
                      ))}
                    </ul>
                  </div>
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
