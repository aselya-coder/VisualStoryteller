import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import NavbarPage from "./NavbarPage";
import HeroPage from "./HeroPage";
import AboutPage from "./AboutPage";
import ServicesPage from "./ServicesPage";
import PortfolioPage from "./PortfolioPage";
import ProcessPage from "./ProcessPage";
import PricingPage from "./PricingPage";
import TestimonialsPage from "./TestimonialsPage";
import CTAPage from "./CTAPage";
import FooterPage from "./FooterPage";
import WhatsAppPage from "./WhatsAppPage";

const AdminApp = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/navbar" element={<NavbarPage />} />
      <Route path="/hero" element={<HeroPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/services" element={<ServicesPage />} />
      <Route path="/portfolio" element={<PortfolioPage />} />
      <Route path="/process" element={<ProcessPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/testimonials" element={<TestimonialsPage />} />
      <Route path="/cta" element={<CTAPage />} />
      <Route path="/footer" element={<FooterPage />} />
      <Route path="/whatsapp" element={<WhatsAppPage />} />
    </Routes>
  );
};

export default AdminApp;
