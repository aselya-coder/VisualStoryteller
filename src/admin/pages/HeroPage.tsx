import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type Hero = { id: number; title: string; subtitle: string; background_image: string; cta_text: string };

const HeroPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Hero[]>([
    {
      id: 1,
      title: "Abadikan Momen, Ceritakan Kisahmu Dengan Visual Berkualitas",
      subtitle: "Kami membantu Anda mengubah momen menjadi karya visual yang berkelas dan tak terlupakan.",
      background_image: "/src/assets/hero-bg.jpg",
      cta_text: "BOOKING SEKARANG",
    },
  ]);
  const [editing, setEditing] = useState<Hero | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Hero | null>(null);

  const columns: Column<Hero>[] = [
    { key: "title", label: "Judul" },
    { key: "subtitle", label: "Subjudul" },
    { key: "cta_text", label: "CTA" },
  ];

  const fields = [
    { name: "title", label: "Judul", type: "text" as const },
    { name: "subtitle", label: "Subjudul", type: "textarea" as const },
    { name: "background_image", label: "Background", type: "image" as const },
    { name: "cta_text", label: "CTA Text", type: "text" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), title: "", subtitle: "", background_image: "", cta_text: "" });
    setModalOpen(true);
  };
  const onEdit = (row: Hero) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Hero) => {
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
    <AdminLayout title="Hero">
      <DataTable<Hero> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Hero" : "Tambah Hero"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default HeroPage;
