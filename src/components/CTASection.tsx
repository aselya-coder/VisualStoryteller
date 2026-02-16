import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listCTA, type CTARow } from "@/admin/api/cta";
import { listWhatsApp, type WhatsAppRow } from "@/admin/api/whatsapp";

const CTASection = () => {
  const { data: ctaData } = useQuery({ enabled: isSupabaseEnabled, queryKey: ["cta"], queryFn: async () => listCTA() });
  const { data: waData } = useQuery({ enabled: isSupabaseEnabled, queryKey: ["whatsapp_settings"], queryFn: async () => listWhatsApp() });

  const cta = (() => {
    if (isSupabaseEnabled) {
      const rows = (ctaData || []) as CTARow[];
      const r = rows[0];
      return r
        ? { title: r.title, subtitle: r.subtitle, button_text: r.button_text }
        : { title: "Siap Membuat Momen Anda Jadi Lebih Berarti?", subtitle: "Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.", button_text: "BOOKING SEKARANG VIA WHATSAPP" };
    }
    return { title: "Siap Membuat Momen Anda Jadi Lebih Berarti?", subtitle: "Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.", button_text: "BOOKING SEKARANG VIA WHATSAPP" };
  })();

  const wa = (() => {
    if (isSupabaseEnabled) {
      const rows = (waData || []) as WhatsAppRow[];
      const r = rows[0];
      const phone = r?.phone || "6285646420488";
      const msg = encodeURIComponent(r?.default_message || "Halo, saya tertarik dengan jasa foto dan video Anda");
      return `https://wa.me/${phone}?text=${msg}`;
    }
    return "https://wa.me/6285646420488?text=Halo,%20saya%20tertarik%20dengan%20jasa%20foto%20dan%20video%20Anda";
  })();

  return (
  <section id="contact" className="py-24 bg-gradient-dark">
    <div className="container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-4 text-sm tracking-[0.3em] text-primary">READY TO CREATE?</p>
        <h2 className="mx-auto mb-6 max-w-3xl text-3xl font-bold md:text-5xl">{cta.title}</h2>
        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">{cta.subtitle}</p>
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-gold px-10 py-5 text-sm font-semibold tracking-widest text-primary-foreground transition-all hover:opacity-90"
        >
          <MessageCircle size={20} />
          {cta.button_text}
        </a>
      </motion.div>
    </div>
  </section>
);
};

export default CTASection;
