import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteProcess, listProcess, upsertProcess } from "@/admin/api/process";

type Step = { id: number; step_number: number; title: string; description: string };

const ProcessPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Step[]>([]);
  const [editing, setEditing] = useState<Step | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Step | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["process"],
    queryFn: async () => listProcess(),
    retry: false,
  });

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

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const samples: Omit<Step, "id">[] = [
      { step_number: 1, title: "Konsultasi", description: "Diskusi kebutuhan & konsep visual Anda" },
      { step_number: 2, title: "Konsep & Brief", description: "Menyusun konsep kreatif & timeline" },
      { step_number: 3, title: "Shooting", description: "Eksekusi sesi foto & video profesional" },
      { step_number: 4, title: "Editing", description: "Post-production & color grading cinematic" },
      { step_number: 5, title: "Delivery", description: "Pengiriman hasil final sesuai jadwal" },
    ];
    try {
      for (const s of samples) {
        await upsertProcess(s as { step_number: number; title: string; description: string });
      }
      await qc.invalidateQueries({ queryKey: ["process"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_process", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, step_number: items.length + 1, title: "", description: "" });
    } else {
      setEditing({ id: Date.now(), step_number: items.length + 1, title: "", description: "" });
    }
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
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertProcess(editing as Partial<Step> & { step_number: number; title: string; description: string });
        await qc.invalidateQueries({ queryKey: ["process"], exact: true });
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
        await deleteProcess(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["process"], exact: true });
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
      const data = (remote || []) as Step[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_process")) {
        seedExamples(true);
      }
    } else {
      setItems([
        { id: 1, step_number: 1, title: "Konsultasi", description: "Diskusi kebutuhan & konsep visual Anda" },
        { id: 2, step_number: 2, title: "Konsep & Brief", description: "Menyusun konsep kreatif & timeline" },
        { id: 3, step_number: 3, title: "Shooting", description: "Eksekusi sesi foto & video profesional" },
        { id: 4, step_number: 4, title: "Editing", description: "Post-production & color grading cinematic" },
        { id: 5, step_number: 5, title: "Delivery", description: "Pengiriman hasil final sesuai jadwal" },
      ]);
    }
  }, [remote, isError, seedExamples]);


  return (
    <AdminLayout title="Process">
      <DataTable<Step> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Step" : "Tambah Step"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default ProcessPage;
