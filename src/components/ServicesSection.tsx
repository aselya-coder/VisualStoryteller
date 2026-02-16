import { motion } from "framer-motion";
import { Camera, Video, Scissors, type LucideProps } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listServices, type ServiceRow } from "@/admin/api/services";

const services = [
  {
    icon: Camera,
    title: "Photography",
    items: ["Wedding", "Wisuda", "Event", "Produk", "Company Profile"],
  },
  {
    icon: Video,
    title: "Videography",
    items: ["Wedding Cinematic", "Event Highlight", "Company Profile Video", "Konten Sosial Media", "Reels & TikTok"],
  },
  {
    icon: Scissors,
    title: "Editing Service",
    items: ["Editing Video Mentah", "Color Grading Cinematic", "Retouching Foto", "Short Video Ads", "Motion Graphic"],
  },
];

const iconMap: Record<string, React.ComponentType<LucideProps>> = {
  Camera,
  Video,
  Scissors,
};

const ServicesSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const { data } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["services"],
    queryFn: async () => listServices(),
  });

  const items = (() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as ServiceRow[];
      return rows.map((r) => ({ icon: iconMap[r.icon] ?? Camera, title: r.name, description: r.description }));
    }
    return services.map((s) => ({ icon: s.icon, title: s.title, description: s.items.join(", ") }));
  })();

  return (
    <section id="services" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm tracking-[0.3em] text-primary">LAYANAN KAMI</p>
          <h2 className="text-3xl font-bold md:text-5xl">
            We Don't Just Shoot.{" "}
            <span className="text-gradient-gold italic">We Tell Stories.</span>
          </h2>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {items.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative overflow-hidden rounded-sm border border-border bg-gradient-card p-8 transition-all hover:border-primary/40 hover:shadow-gold"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-primary/30 text-primary">
                <s.icon size={28} />
              </div>
              <h3 className="mb-4 font-display text-2xl font-semibold">{s.title}</h3>
              <p className="mb-6 text-sm text-muted-foreground">{s.description}</p>
              <button
                onClick={() => scrollTo("#contact")}
                className="text-sm tracking-wide text-primary transition-opacity hover:opacity-80"
              >
                Konsultasi Gratis →
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
