import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type Portfolio = { id: number; title: string; image: string; category: string; link: string };

const PortfolioPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Portfolio[]>([
    { id: 1, title: "Wedding Golden Hour", image: "/src/assets/portfolio-wedding.jpg", category: "Wedding", link: "#" },
    { id: 2, title: "Corporate Event Stage", image: "/src/assets/portfolio-event.jpg", category: "Event", link: "#" },
    { id: 3, title: "Professional Portrait", image: "/src/assets/portfolio-corporate.jpg", category: "Corporate", link: "#" },
    { id: 4, title: "Graduation Day", image: "/src/assets/portfolio-wisuda.jpg", category: "Personal", link: "#" },
    { id: 5, title: "Creative Branding", image: "/src/assets/portfolio-personal.jpg", category: "Personal", link: "#" },
    { id: 6, title: "Product Photography", image: "/src/assets/portfolio-product.jpg", category: "Corporate", link: "#" },
  ]);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Portfolio | null>(null);

  const columns: Column<Portfolio>[] = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori" },
    { key: "link", label: "Link" },
  ];

  const fields = [
    { name: "title", label: "Judul", type: "text" as const },
    { name: "image", label: "Gambar", type: "image" as const },
    { name: "category", label: "Kategori", type: "text" as const },
    { name: "link", label: "Link", type: "text" as const },
  ];

  const categories = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);

  const onAdd = () => {
    setEditing({ id: Date.now(), title: "", image: "", category: "", link: "" });
    setModalOpen(true);
  };
  const onEdit = (row: Portfolio) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Portfolio) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const save = () => {
    if (!editing) return;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === editing.id);
      if (idx >= 0) return prev.map((p) => (p.id === editing.id ? editing : p));
      return [...prev, editing];
    });
    setModalOpen(false);
    toast({ title: "Tersimpan" });
  };
  const confirmDelete = () => {
    if (!toDelete) return;
    setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
    setConfirmOpen(false);
    toast({ title: "Terhapus" });
  };

  return (
    <AdminLayout title="Portfolio">
      <DataTable<Portfolio> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} filter={{ key: "category", options: categories }} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Portfolio" : "Tambah Portfolio"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default PortfolioPage;
