import { useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";

type Pricing = { id: number; name: string; price: number; features: string[] };

const PricingPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Pricing[]>([
    { id: 1, name: "Silver", price: 1500000, features: ["1 Fotografer", "3 Jam Sesi", "50 Foto Edit", "File Digital HD", "Delivery 5 Hari"] },
    { id: 2, name: "Gold", price: 3500000, features: ["1 Foto + 1 Videografer", "5 Jam Sesi", "1 Video Highlight", "100 Foto Edit", "File Digital HD", "Delivery 7 Hari"] },
    { id: 3, name: "Platinum", price: 7500000, features: ["Full Team", "8 Jam Sesi", "Cinematic Video", "Drone Coverage", "Unlimited Foto Edit", "File 4K", "Delivery 14 Hari"] },
  ]);
  const [editing, setEditing] = useState<Pricing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Pricing | null>(null);

  const columns: Column<Pricing>[] = [
    { key: "name", label: "Nama" },
    { key: "price", label: "Harga" },
    { key: "features", label: "Fitur", render: (row) => (row.features || []).join(", ") },
  ];

  const fields = [
    { name: "name", label: "Nama", type: "text" as const },
    { name: "price", label: "Harga", type: "number" as const },
    { name: "features", label: "Fitur", type: "array" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), name: "", price: 0, features: [] });
    setModalOpen(true);
  };
  const onEdit = (row: Pricing) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Pricing) => {
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
    <AdminLayout title="Pricing">
      <DataTable<Pricing> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Pricing" : "Tambah Pricing"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default PricingPage;
