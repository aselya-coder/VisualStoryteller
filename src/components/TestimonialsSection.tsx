import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah & Andi",
    role: "Wedding Client",
    text: "Hasil video wedding kami luar biasa! Tim sangat profesional dan hasilnya melebihi ekspektasi. Setiap momen terabadikan dengan sempurna.",
  },
  {
    name: "Budi Santoso",
    role: "Corporate Client",
    text: "Company profile video yang dihasilkan sangat berkualitas. Editing cinematic-nya membuat brand kami terlihat premium dan profesional.",
  },
  {
    name: "Anisa Putri",
    role: "Graduation Client",
    text: "Foto wisuda saya jadi kenangan terbaik! Fotografernya sangat sabar dan kreatif dalam mengarahkan pose. Hasilnya amazing!",
  },
  {
    name: "PT. Maju Bersama",
    role: "Event Client",
    text: "Sudah 3 kali menggunakan jasa mereka untuk event perusahaan. Selalu puas dengan hasilnya. Highly recommended!",
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((c) => (c + 1) % testimonials.length);
  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section id="testimonials" className="py-24 bg-gradient-dark">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <p className="mb-2 text-sm tracking-[0.3em] text-primary">TESTIMONI</p>
          <h2 className="text-3xl font-bold md:text-5xl">
            Apa Kata <span className="text-gradient-gold italic">Klien</span> Kami
          </h2>
        </motion.div>

        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={20} className="fill-primary text-primary" />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <p className="mb-8 font-display text-xl italic leading-relaxed text-foreground/90 md:text-2xl">
                "{t.text}"
              </p>
              <p className="font-semibold text-foreground">{t.name}</p>
              <p className="text-sm text-primary">{t.role}</p>
            </motion.div>
          </AnimatePresence>

          <div className="mt-10 flex justify-center gap-4">
            <button
              onClick={prev}
              className="flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              className="flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
