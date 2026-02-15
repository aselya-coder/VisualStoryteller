import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type FooterItem = { id: number; address: string; email: string; phone: string; social_links: string[] };

const FooterPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FooterItem[]>([
    {
      id: 1,
      address: "Jl. Kreatif No. 10, Jakarta Selatan",
      email: "admin@visualstoryteller.app",
      phone: "+62 856-4642-0488",
      social_links: ["@visual.studio"],
    },
  ]);
  const [editing, setEditing] = useState<FooterItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<FooterItem | null>(null);

  const columns: Column<FooterItem>[] = [
    { key: "address", label: "Alamat" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telepon" },
    { key: "social_links", label: "Social", render: (row) => (row.social_links || []).join(", ") },
  ];

  const fields = [
    { name: "address", label: "Alamat", type: "text" as const },
    { name: "email", label: "Email", type: "text" as const },
    { name: "phone", label: "Telepon", type: "text" as const },
    { name: "social_links", label: "Social Links", type: "array" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), address: "", email: "", phone: "", social_links: [] });
    setModalOpen(true);
  };
  const onEdit = (row: FooterItem) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: FooterItem) => {
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
    <AdminLayout title="Footer">
      <DataTable<FooterItem> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Footer" : "Tambah Footer"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default FooterPage;
