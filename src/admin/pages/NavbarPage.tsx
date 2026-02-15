import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type NavbarItem = { id: number; logo_url: string; menu: string[] };

const NavbarPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<NavbarItem[]>([
    {
      id: 1,
      logo_url: "",
      menu: ["Beranda", "Tentang", "Layanan", "Portofolio", "Harga", "Testimoni", "Kontak"],
    },
  ]);
  const [editing, setEditing] = useState<NavbarItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<NavbarItem | null>(null);

  const columns: Column<NavbarItem>[] = [
    { key: "logo_url", label: "Logo" },
    { key: "menu", label: "Menu", render: (row) => (row.menu || []).join(", ") },
  ];

  const fields = [
    { name: "logo_url", label: "Logo URL", type: "text" as const },
    { name: "menu", label: "Menu", type: "array" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), logo_url: "", menu: [] });
    setModalOpen(true);
  };
  const onEdit = (row: NavbarItem) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: NavbarItem) => {
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
    <AdminLayout title="Navbar">
      <DataTable<NavbarItem> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Navbar" : "Tambah Navbar"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default NavbarPage;
