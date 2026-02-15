import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type About = { id: number; title: string; description: string; image: string };

const AboutPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<About[]>([
    {
      id: 1,
      title: "Kenapa Memilih Kami?",
      description:
        "Tim profesional, peralatan modern, editing cinematic, tepat waktu, dan harga transparan.",
      image: "",
    },
  ]);
  const [editing, setEditing] = useState<About | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<About | null>(null);

  const columns: Column<About>[] = [
    { key: "title", label: "Judul" },
    { key: "description", label: "Deskripsi" },
  ];

  const fields = [
    { name: "title", label: "Judul", type: "text" as const },
    { name: "description", label: "Deskripsi", type: "textarea" as const },
    { name: "image", label: "Gambar", type: "image" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), title: "", description: "", image: "" });
    setModalOpen(true);
  };
  const onEdit = (row: About) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: About) => {
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
    <AdminLayout title="About">
      <DataTable<About> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit About" : "Tambah About"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default AboutPage;
