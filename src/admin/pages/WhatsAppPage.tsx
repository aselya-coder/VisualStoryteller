import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type WhatsApp = { id: number; phone: string; default_message: string };

const WhatsAppPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WhatsApp[]>([
    {
      id: 1,
      phone: "+62 856-4642-0488",
      default_message: "Halo, saya tertarik dengan jasa foto dan video Anda",
    },
  ]);
  const [editing, setEditing] = useState<WhatsApp | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<WhatsApp | null>(null);

  const columns: Column<WhatsApp>[] = [
    { key: "phone", label: "Nomor" },
    { key: "default_message", label: "Pesan Default" },
  ];

  const fields = [
    { name: "phone", label: "Nomor", type: "text" as const },
    { name: "default_message", label: "Pesan Default", type: "textarea" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), phone: "", default_message: "" });
    setModalOpen(true);
  };
  const onEdit = (row: WhatsApp) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: WhatsApp) => {
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
    <AdminLayout title="WhatsApp Settings">
      <DataTable<WhatsApp> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit WhatsApp" : "Tambah WhatsApp"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default WhatsAppPage;
