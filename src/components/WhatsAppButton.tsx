import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { listWhatsApp, type WhatsAppRow } from "@/admin/api/whatsapp";

const WhatsAppButton = () => {
  const { data } = useQuery({ enabled: isSupabaseEnabled, queryKey: ["whatsapp_settings"], queryFn: async () => listWhatsApp() });
  const href = (() => {
    if (isSupabaseEnabled) {
      const rows = (data || []) as WhatsAppRow[];
      const r = rows[0];
      const phone = r?.phone || "6285646420488";
      const msg = encodeURIComponent(r?.default_message || "Halo, saya tertarik dengan jasa foto dan video Anda");
      return `https://wa.me/${phone}?text=${msg}`;
    }
    return "https://wa.me/6285646420488?text=Halo,%20saya%20tertarik%20dengan%20jasa%20foto%20dan%20video%20Anda";
  })();

  return (
  <motion.a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-primary-foreground shadow-lg transition-transform hover:scale-110"
    initial={{ scale: 0 }}
    animate={{ scale: 1 }}
    transition={{ delay: 1, type: "spring" }}
    aria-label="Chat via WhatsApp"
  >
    <MessageCircle size={26} />
  </motion.a>
);
};

export default WhatsAppButton;
