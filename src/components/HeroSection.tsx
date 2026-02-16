import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listHero, type HeroRow } from "@/admin/api/hero";

const HeroSection = () => {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const { data } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["hero"],
    queryFn: async () => listHero(),
  });

  const hero = (() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as HeroRow[];
      const r = rows[0];
      return r
        ? {
            title: r.title,
            subtitle: r.subtitle,
            background_image: r.background_image || heroBg,
            cta_text: r.cta_text || "BOOKING SEKARANG",
          }
        : {
            title: "Abadikan Momen, Ceritakan Kisahmu Dengan Visual Berkualitas",
            subtitle: "Kami membantu Anda mengubah momen menjadi karya visual yang berkelas dan tak terlupakan.",
            background_image: heroBg,
            cta_text: "BOOKING SEKARANG",
          };
    }
    return {
      title: "Abadikan Momen, Ceritakan Kisahmu Dengan Visual Berkualitas",
      subtitle: "Kami membantu Anda mengubah momen menjadi karya visual yang berkelas dan tak terlupakan.",
      background_image: heroBg,
      cta_text: "BOOKING SEKARANG",
    };
  })();

  return (
    <section id="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={hero.background_image} alt="Cinematic camera setup" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 text-sm tracking-[0.3em] text-primary"
        >
          CREATIVE VISUAL PRODUCTION
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mx-auto mb-6 max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl"
        >
          {hero.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            onClick={() => scrollTo("#contact")}
            className="bg-gradient-gold px-8 py-4 text-sm font-semibold tracking-widest text-primary-foreground transition-all hover:opacity-90"
          >
            {hero.cta_text}
          </button>
          <button
            onClick={() => scrollTo("#portfolio")}
            className="border border-foreground/30 px-8 py-4 text-sm tracking-widest text-foreground transition-all hover:border-primary hover:text-primary"
          >
            LIHAT PORTOFOLIO
          </button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="h-10 w-6 rounded-full border-2 border-primary/40 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="h-2 w-1 rounded-full bg-primary"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
