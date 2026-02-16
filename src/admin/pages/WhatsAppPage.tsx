import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteWhatsApp, listWhatsApp, upsertWhatsApp } from "@/admin/api/whatsapp";

type WhatsApp = { id: number; phone: string; default_message: string };

const WhatsAppPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<WhatsApp[]>([]);
  const [editing, setEditing] = useState<WhatsApp | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<WhatsApp | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["whatsapp_settings"],
    queryFn: async () => listWhatsApp(),
    retry: false,
  });

  const columns: Column<WhatsApp>[] = [
    { key: "phone", label: "Nomor" },
    { key: "default_message", label: "Pesan Default" },
  ];

  const fields = [
    { name: "phone", label: "Nomor", type: "text" as const },
    { name: "default_message", label: "Pesan Default", type: "textarea" as const },
  ];

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<WhatsApp, "id"> = {
      phone: "+62 856-4642-0488",
      default_message: "Halo, saya tertarik dengan jasa foto dan video Anda",
    };
    try {
      await upsertWhatsApp(sample as { phone: string; default_message: string });
      await qc.invalidateQueries({ queryKey: ["whatsapp_settings"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_whatsapp", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, phone: "", default_message: "" });
    } else {
      setEditing({ id: Date.now(), phone: "", default_message: "" });
    }
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
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertWhatsApp(editing as Partial<WhatsApp> & { phone: string; default_message: string });
        await qc.invalidateQueries({ queryKey: ["whatsapp_settings"], exact: true });
        setModalOpen(false);
        toast({ title: "Tersimpan" });
        return;
      } catch (e: unknown) {
        toast({ title: "Gagal menyimpan", description: e instanceof Error ? e.message : String(e) });
        return;
      }
    }
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.id === editing.id);
      if (idx >= 0) return prev.map((p) => (p.id === editing.id ? editing : p));
      return [...prev, editing];
    });
    setModalOpen(false);
    toast({ title: "Tersimpan" });
  };
  const confirmDelete = async () => {
    if (!toDelete) return;
    if (isSupabaseEnabled) {
      try {
        await deleteWhatsApp(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["whatsapp_settings"], exact: true });
        setConfirmOpen(false);
        toast({ title: "Terhapus" });
        return;
      } catch (e: unknown) {
        toast({ title: "Gagal menghapus", description: e instanceof Error ? e.message : String(e) });
        return;
      }
    }
    setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
    setConfirmOpen(false);
    toast({ title: "Terhapus" });
  };

  useEffect(() => {
    if (isSupabaseEnabled && !isError) {
      const data = (remote || []) as WhatsApp[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_whatsapp")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          phone: "+62 856-4642-0488",
          default_message: "Halo, saya tertarik dengan jasa foto dan video Anda",
        },
      ]);
    }
  }, [remote, isError, seedExamples]);


  return (
    <AdminLayout title="WhatsApp Settings">
      <DataTable<WhatsApp> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit WhatsApp" : "Tambah WhatsApp"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default WhatsAppPage;
