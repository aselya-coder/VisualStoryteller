import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listProcess, type ProcessRow } from "@/admin/api/process";

const staticSteps = [
  { icon: MessageSquare, title: "Konsultasi", desc: "Diskusi kebutuhan & konsep visual Anda" },
  { icon: MessageSquare, title: "Konsep & Brief", desc: "Menyusun konsep kreatif & timeline" },
  { icon: MessageSquare, title: "Shooting", desc: "Eksekusi sesi foto & video profesional" },
  { icon: MessageSquare, title: "Editing", desc: "Post-production & color grading cinematic" },
  { icon: MessageSquare, title: "Delivery", desc: "Pengiriman hasil final sesuai jadwal" },
];

const ProcessSection = () => {
  const { data } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["process"],
    queryFn: async () => listProcess(),
  });

  const steps = (() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as ProcessRow[];
      return rows.map((r) => ({ icon: MessageSquare, title: r.title, desc: r.description }));
    }
    return staticSteps;
  })();

  return (
  <section className="py-24">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-2 text-sm tracking-[0.3em] text-primary">PROSES KERJA</p>
        <h2 className="text-3xl font-bold md:text-5xl">
          Bagaimana Kami <span className="text-gradient-gold italic">Bekerja</span>
        </h2>
      </motion.div>

      <div className="relative mx-auto max-w-4xl">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 hidden h-full w-px bg-border md:left-1/2 md:block" />

        {steps.map((step, i) => (
          <motion.div
            key={step.title}
            initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className={`relative mb-12 flex items-start gap-6 md:gap-0 ${
              i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Content */}
            <div className={`flex-1 ${i % 2 === 0 ? "md:pr-16 md:text-right" : "md:pl-16"}`}>
              <div className="rounded-sm border border-border bg-card p-6 transition-all hover:border-primary/40 hover:shadow-gold">
                <div className={`mb-3 flex items-center gap-3 ${i % 2 === 0 ? "md:justify-end" : ""}`}>
                  <step.icon size={20} className="text-primary" />
                  <span className="text-xs tracking-[0.2em] text-primary">STEP {i + 1}</span>
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </div>
            </div>

            {/* Timeline dot */}
            <div className="hidden h-4 w-4 shrink-0 rounded-full border-2 border-primary bg-background md:absolute md:left-1/2 md:top-8 md:block md:-translate-x-1/2" />

            {/* Empty space for other side */}
            <div className="hidden flex-1 md:block" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
  );
};

export default ProcessSection;
