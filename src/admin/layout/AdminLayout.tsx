import HeaderAdmin from "@/admin/components/HeaderAdmin";
import { AdminSidebar } from "@/admin/components/AdminSidebar";

const AdminLayout = ({ title, children }: { title: string; children: React.ReactNode }) => {
  return (
    <AdminSidebar>
      <HeaderAdmin title={title} />
      <div className="p-4">{children}</div>
    </AdminSidebar>
  );
};

export default AdminLayout;

