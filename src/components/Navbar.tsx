import { useState, useEffect, useMemo } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listNavbar, type NavbarRow } from "@/admin/api/navbar";

const defaultNavItems = [
  { label: "Beranda", href: "#hero" },
  { label: "Tentang", href: "#about" },
  { label: "Layanan", href: "#services" },
  { label: "Portofolio", href: "#portfolio" },
  { label: "Harga", href: "#pricing" },
  { label: "Testimoni", href: "#testimonials" },
  { label: "Kontak", href: "#contact" },
];

const hrefMap: Record<string, string> = {
  Beranda: "#hero",
  Tentang: "#about",
  Layanan: "#services",
  Portofolio: "#portfolio",
  Harga: "#pricing",
  Testimoni: "#testimonials",
  Kontak: "#contact",
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data } = useQuery({ enabled: isSupabaseEnabled, queryKey: ["navbar"], queryFn: async () => listNavbar() });

  const navItems = useMemo(() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as NavbarRow[];
      const r = rows[0];
      const menu = r?.menu || defaultNavItems.map((i) => i.label);
      return menu.map((label) => ({ label, href: hrefMap[label] || "#" }));
    }
    return defaultNavItems;
  }, [data]);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled ? "glass border-b border-gold/20" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <button
          onClick={() => scrollTo("#hero")}
          className="font-display text-xl tracking-wider text-foreground border-0 outline-none focus:outline-none ring-0 focus:ring-0 bg-transparent rounded-none"
        >
          <span className="text-gradient-gold">VISUAL</span> STUDIO
        </button>

        {/* Desktop */}
        <ul className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.href}>
              <button
                onClick={() => scrollTo(item.href)}
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={() => scrollTo("#contact")}
          className="hidden rounded-none border border-primary bg-transparent px-6 py-2 text-sm tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground md:block"
        >
          BOOKING
        </button>

        {/* Mobile toggle */}
        <button className="text-foreground md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="glass border-b border-gold/20 md:hidden"
          >
            <ul className="flex flex-col items-center gap-6 py-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <button
                    onClick={() => scrollTo(item.href)}
                    className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollTo("#contact")}
                  className="border border-primary px-6 py-2 text-sm tracking-widest text-primary transition-all hover:bg-primary hover:text-primary-foreground"
                >
                  BOOKING
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
