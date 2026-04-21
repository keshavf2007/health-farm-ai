import { Leaf } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-border bg-gradient-soft mt-24">
    <div className="container py-12 grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary">
            <Leaf className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">AgroGuard <span className="text-primary">AI</span></span>
        </div>
        <p className="text-muted-foreground max-w-md">
          Empowering farmers with AI-driven insights for healthier crops, smarter irrigation, and sustainable harvests.
        </p>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Product</h4>
        <ul className="space-y-2 text-sm">
          <li><Link to="/detect" className="hover:text-primary transition-colors">Pest Detection</Link></li>
          <li><Link to="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
          <li><Link to="/library" className="hover:text-primary transition-colors">Pest Library</Link></li>
        </ul>
      </div>
      <div>
        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider text-muted-foreground">Company</h4>
        <ul className="space-y-2 text-sm">
          <li><a className="hover:text-primary transition-colors" href="#">About</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Contact</a></li>
          <li><a className="hover:text-primary transition-colors" href="#">Privacy</a></li>
        </ul>
      </div>
    </div>
    <div className="border-t border-border">
      <div className="container py-5 text-xs text-muted-foreground flex justify-between flex-wrap gap-2">
        <span>© {new Date().getFullYear()} AgroGuard AI. All rights reserved.</span>
        <span>Cultivating a smarter tomorrow 🌱</span>
      </div>
    </div>
  </footer>
);
