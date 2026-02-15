import { motion } from "framer-motion";
import { Users, Aperture, Film, Clock, BadgeCheck } from "lucide-react";

const features = [
  { icon: Users, title: "Tim Profesional", desc: "Berpengalaman di berbagai event & industri" },
  { icon: Aperture, title: "Peralatan Modern", desc: "Kamera & lighting terkini untuk hasil terbaik" },
  { icon: Film, title: "Editing Cinematic", desc: "Color grading & editing berkelas internasional" },
  { icon: Clock, title: "Tepat Waktu", desc: "Delivery sesuai jadwal yang disepakati" },
  { icon: BadgeCheck, title: "Harga Transparan", desc: "Tanpa biaya tersembunyi, sesuai budget Anda" },
];

const AboutSection = () => (
  <section id="about" className="py-24 bg-gradient-dark">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <p className="mb-2 text-sm tracking-[0.3em] text-primary">TENTANG KAMI</p>
        <h2 className="text-3xl font-bold md:text-5xl">
          Kenapa Memilih <span className="text-gradient-gold italic">Kami?</span>
        </h2>
      </motion.div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group flex flex-col items-center rounded-sm border border-border bg-card p-8 text-center transition-all hover:border-primary/40 hover:shadow-gold"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <f.icon size={24} />
            </div>
            <h3 className="mb-2 font-display text-lg font-semibold">{f.title}</h3>
            <p className="text-sm text-muted-foreground">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AboutSection;
