import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type CTA = { id: number; title: string; subtitle: string; button_text: string };

const CTAPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<CTA[]>([
    {
      id: 1,
      title: "Siap Membuat Momen Anda Jadi Lebih Berarti?",
      subtitle:
        "Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.",
      button_text: "BOOKING SEKARANG VIA WHATSAPP",
    },
  ]);
  const [editing, setEditing] = useState<CTA | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CTA | null>(null);

  const columns: Column<CTA>[] = [
    { key: "title", label: "Judul" },
    { key: "subtitle", label: "Subjudul" },
    { key: "button_text", label: "Tombol" },
  ];

  const fields = [
    { name: "title", label: "Judul", type: "text" as const },
    { name: "subtitle", label: "Subjudul", type: "textarea" as const },
    { name: "button_text", label: "Teks Tombol", type: "text" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), title: "", subtitle: "", button_text: "" });
    setModalOpen(true);
  };
  const onEdit = (row: CTA) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: CTA) => {
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
    <AdminLayout title="CTA">
      <DataTable<CTA> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit CTA" : "Tambah CTA"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default CTAPage;
