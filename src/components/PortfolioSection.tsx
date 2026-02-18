import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listPortfolio, type PortfolioRow } from "@/admin/api/portfolio";

import weddingImg from "@/assets/portfolio-wedding.jpg";
import eventImg from "@/assets/portfolio-event.jpg";
import corporateImg from "@/assets/portfolio-corporate.jpg";
import wisudaImg from "@/assets/portfolio-wisuda.jpg";
import personalImg from "@/assets/portfolio-personal.jpg";
import productImg from "@/assets/portfolio-product.jpg";

const portfolioItems = [
  { src: weddingImg, category: "Wedding", title: "Wedding Golden Hour" },
  { src: eventImg, category: "Event", title: "Corporate Event Stage" },
  { src: corporateImg, category: "Corporate", title: "Professional Portrait" },
  { src: wisudaImg, category: "Personal", title: "Graduation Day" },
  { src: personalImg, category: "Personal", title: "Creative Branding" },
  { src: productImg, category: "Corporate", title: "Product Photography" },
];

const staticFilters = ["Semua", "Wedding", "Event", "Corporate", "Personal"];
const CATEGORY_ORDER = ["Wedding", "Event", "Corporate", "Personal"] as const;
const ORDER_INDEX: Record<string, number> = { Wedding: 0, Event: 1, Corporate: 2, Personal: 3 };

const PortfolioSection = () => {
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const { data } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["portfolio"],
    queryFn: async () => listPortfolio(),
  });

  const items = useMemo(() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as PortfolioRow[];
      if (!rows || rows.length === 0) {
        return portfolioItems;
      }
      const mapped = rows.map((r) => ({ id: r.id, src: r.image, category: r.category, title: r.title }));
      mapped.sort((a, b) => (a.id ?? 0) - (b.id ?? 0));
      return mapped;
    }
    return portfolioItems;
  }, [data]);

  const filters = useMemo(() => staticFilters, []);

  const filtered = activeFilter === "Semua" ? items : items.filter((p) => p.category === activeFilter);

  const ordered = useMemo(() => {
    const base = filtered.slice();
    const gi = base.findIndex((i) => i.title === "Graduation Day");
    const pi = base.findIndex((i) => i.title === "Professional Portrait");
    if (gi >= 0 && pi >= 0) {
      const grad = base[gi];
      const prof = base[pi];
      const first = Math.min(gi, pi);
      // remove both
      base.splice(Math.max(gi, pi), 1);
      base.splice(Math.min(gi, pi), 1);
      // insert consecutively starting at the earlier index
      base.splice(first, 0, grad.title === "Graduation Day" ? grad : prof);
      base.splice(first + 1, 0, prof.title === "Professional Portrait" ? prof : grad);
    }
    return base;
  }, [filtered]);


  return (
    <section id="portfolio" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="mb-2 text-sm tracking-[0.3em] text-primary">PORTOFOLIO</p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Karya <span className="text-gradient-gold italic">Terbaik</span> Kami
          </h2>
        </motion.div>

        {/* Filters */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-5 py-2 text-sm tracking-wide transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground"
                  : "border border-border text-muted-foreground hover:border-primary hover:text-primary"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {ordered.map((item) => (
              <motion.div
                key={(item as { id?: number }).id ?? `${item.title}|${item.src}|${item.category}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative cursor-pointer overflow-hidden"
                onClick={() => setSelectedImage(item.src)}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <p className="text-sm tracking-[0.2em] text-primary">{item.category}</p>
                  <p className="font-display text-xl font-semibold">{item.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-6"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute right-6 top-6 text-foreground hover:text-primary">
              <X size={32} />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={selectedImage}
              alt="Preview"
              className="max-h-[85vh] max-w-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default PortfolioSection;
