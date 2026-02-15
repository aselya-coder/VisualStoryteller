import AdminLayout from "@/admin/layout/AdminLayout";
import StatsCard from "@/admin/components/StatsCard";
import { Briefcase, GalleryHorizontalEnd, MessageSquareQuote, Wallet } from "lucide-react";

const Dashboard = () => {
  const stats = {
    services: 6,
    portfolio: 12,
    testimonials: 8,
    pricing: 4,
  };
  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Services" value={stats.services} icon={Briefcase} />
        <StatsCard title="Total Portfolio" value={stats.portfolio} icon={GalleryHorizontalEnd} />
        <StatsCard title="Total Testimonials" value={stats.testimonials} icon={MessageSquareQuote} />
        <StatsCard title="Total Pricing" value={stats.pricing} icon={Wallet} />
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

