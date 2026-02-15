import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type Step = { id: number; step_number: number; title: string; description: string };

const ProcessPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Step[]>([
    { id: 1, step_number: 1, title: "Konsultasi", description: "Diskusi kebutuhan & konsep visual Anda" },
    { id: 2, step_number: 2, title: "Konsep & Brief", description: "Menyusun konsep kreatif & timeline" },
    { id: 3, step_number: 3, title: "Shooting", description: "Eksekusi sesi foto & video profesional" },
    { id: 4, step_number: 4, title: "Editing", description: "Post-production & color grading cinematic" },
    { id: 5, step_number: 5, title: "Delivery", description: "Pengiriman hasil final sesuai jadwal" },
  ]);
  const [editing, setEditing] = useState<Step | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Step | null>(null);

  const columns: Column<Step>[] = [
    { key: "step_number", label: "Step" },
    { key: "title", label: "Judul" },
    { key: "description", label: "Deskripsi" },
  ];

  const fields = [
    { name: "step_number", label: "Step", type: "number" as const },
    { name: "title", label: "Judul", type: "text" as const },
    { name: "description", label: "Deskripsi", type: "textarea" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), step_number: items.length + 1, title: "", description: "" });
    setModalOpen(true);
  };
  const onEdit = (row: Step) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Step) => {
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
    <AdminLayout title="Process">
      <DataTable<Step> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Step" : "Tambah Step"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default ProcessPage;
