import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const CTASection = () => (
  <section id="contact" className="py-24 bg-gradient-dark">
    <div className="container mx-auto px-6 text-center">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="mb-4 text-sm tracking-[0.3em] text-primary">READY TO CREATE?</p>
        <h2 className="mx-auto mb-6 max-w-3xl text-3xl font-bold md:text-5xl">
          Siap Membuat Momen Anda Jadi{" "}
          <span className="text-gradient-gold italic">Lebih Berarti?</span>
        </h2>
        <p className="mx-auto mb-10 max-w-xl text-muted-foreground">
          Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.
        </p>
        <a
          href="https://wa.me/6281234567890?text=Halo,%20saya%20tertarik%20dengan%20jasa%20foto%20dan%20video%20Anda"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-3 bg-gradient-gold px-10 py-5 text-sm font-semibold tracking-widest text-primary-foreground transition-all hover:opacity-90"
        >
          <MessageCircle size={20} />
          BOOKING SEKARANG VIA WHATSAPP
        </a>
      </motion.div>
    </div>
  </section>
);

export default CTASection;
