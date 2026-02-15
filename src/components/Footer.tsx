import { Instagram, Phone, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-16">
    <div className="container mx-auto px-6">
      <div className="grid gap-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="mb-4 font-display text-xl tracking-wider">
            <span className="text-gradient-gold">VISUAL</span> STUDIO
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Creative Visual Production — We don't just shoot, we tell stories. Jasa foto, video & editing profesional untuk setiap momen berharga Anda.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-4 text-sm font-semibold tracking-[0.2em] text-primary">LAYANAN</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Wedding Photography</li>
            <li>Event Videography</li>
            <li>Company Profile</li>
            <li>Editing & Color Grading</li>
            <li>Content Creation</li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="mb-4 text-sm font-semibold tracking-[0.2em] text-primary">KONTAK</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Phone size={16} className="text-primary" />
              +62 856-4642-0488
            </li>
            <li className="flex items-center gap-3">
              <Instagram size={16} className="text-primary" />
              @visual.studio
            </li>
            <li className="flex items-start gap-3">
              <MapPin size={16} className="mt-0.5 text-primary" />
              Jl. Kreatif No. 10, Jakarta Selatan
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-border pt-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Visual Studio. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
