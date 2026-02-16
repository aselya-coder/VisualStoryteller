import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listPricing, type PricingRow } from "@/admin/api/pricing";

const packages = [
  {
    name: "Silver",
    price: "1.500.000",
    popular: false,
    features: ["1 Fotografer", "3 Jam Sesi", "50 Foto Edit", "File Digital HD", "Delivery 5 Hari"],
  },
  {
    name: "Gold",
    price: "3.500.000",
    popular: true,
    features: ["1 Foto + 1 Videografer", "5 Jam Sesi", "1 Video Highlight", "100 Foto Edit", "File Digital HD", "Delivery 7 Hari"],
  },
  {
    name: "Platinum",
    price: "7.500.000",
    popular: false,
    features: ["Full Team", "8 Jam Sesi", "Cinematic Video", "Drone Coverage", "Unlimited Foto Edit", "File 4K", "Delivery 14 Hari"],
  },
];

const PricingSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const { data } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["pricing"],
    queryFn: async () => listPricing(),
  });

  const items = (() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as PricingRow[];
      return rows.map((r, i) => ({ name: r.name, price: r.price, features: r.features, popular: i === 1 }));
    }
    return packages.map((p, i) => ({ name: p.name, price: Number(p.price.replace(/\./g, "")), features: p.features, popular: p.popular }));
  })();

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm tracking-[0.3em] text-primary">PAKET HARGA</p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Pilih Paket <span className="text-gradient-gold italic">Terbaik</span> Anda
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((pkg, i) => (
            <motion.div
              key={pkg.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className={`relative flex flex-col rounded-sm border p-8 transition-all hover:shadow-gold ${
                pkg.popular
                  ? "border-primary bg-gradient-card shadow-gold"
                  : "border-border bg-card"
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gradient-gold px-4 py-1 text-xs font-semibold tracking-widest text-primary-foreground">
                  <Star size={12} /> POPULER
                </div>
              )}
              <div className="mb-6 text-center">
                <p className="mb-1 text-sm tracking-[0.2em] text-primary">✨ {pkg.name}</p>
                <p className="font-display text-4xl font-bold">
                  <span className="text-lg text-muted-foreground">Rp</span> {new Intl.NumberFormat("id-ID").format(pkg.price)}
                </p>
              </div>
              <ul className="mb-8 flex-1 space-y-3">
                {pkg.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Check size={16} className="shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => scrollTo("#contact")}
                className={`w-full py-3 text-sm font-semibold tracking-widest transition-all ${
                  pkg.popular
                    ? "bg-gradient-gold text-primary-foreground hover:opacity-90"
                    : "border border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                }`}
              >
                PESAN SEKARANG
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
