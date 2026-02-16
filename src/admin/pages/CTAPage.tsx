import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteCTA, listCTA, upsertCTA } from "@/admin/api/cta";

type CTA = { id: number; title: string; subtitle: string; button_text: string };

const CTAPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<CTA[]>([]);
  const [editing, setEditing] = useState<CTA | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<CTA | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["cta"],
    queryFn: async () => listCTA(),
    retry: false,
  });

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

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<CTA, "id"> = {
      title: "Siap Membuat Momen Anda Jadi Lebih Berarti?",
      subtitle:
        "Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.",
      button_text: "BOOKING SEKARANG VIA WHATSAPP",
    };
    try {
      await upsertCTA(sample as { title: string; subtitle: string; button_text: string });
      await qc.invalidateQueries({ queryKey: ["cta"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_cta", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, title: "", subtitle: "", button_text: "" });
    } else {
      setEditing({ id: Date.now(), title: "", subtitle: "", button_text: "" });
    }
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
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertCTA(editing as Partial<{ id: number; title: string; subtitle: string; button_text: string }> & { title: string; subtitle: string; button_text: string });
        await qc.invalidateQueries({ queryKey: ["cta"], exact: true });
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
        await deleteCTA(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["cta"], exact: true });
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
      const data = (remote || []) as CTA[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_cta")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          title: "Siap Membuat Momen Anda Jadi Lebih Berarti?",
          subtitle:
            "Hubungi kami sekarang untuk konsultasi gratis dan dapatkan penawaran terbaik untuk kebutuhan visual Anda.",
          button_text: "BOOKING SEKARANG VIA WHATSAPP",
        },
      ]);
    }
  }, [remote, isError, seedExamples]);


  return (
    <AdminLayout title="CTA">
      <DataTable<CTA> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit CTA" : "Tambah CTA"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default CTAPage;
