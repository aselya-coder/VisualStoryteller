import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteAbout, listAbout, upsertAbout } from "@/admin/api/about";

type About = { id: number; title: string; description: string; image: string };

const AboutPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<About[]>([]);
  const [editing, setEditing] = useState<About | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<About | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["about"],
    queryFn: async () => listAbout(),
    retry: false,
  });

  const columns: Column<About>[] = [
    { key: "title", label: "Judul" },
    { key: "description", label: "Deskripsi" },
  ];

  const fields = [
    { name: "title", label: "Judul", type: "text" as const },
    { name: "description", label: "Deskripsi", type: "textarea" as const },
    { name: "image", label: "Gambar", type: "image" as const },
  ];

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<About, "id"> = {
      title: "Kenapa Memilih Kami?",
      description: "Tim profesional, peralatan modern, editing cinematic, tepat waktu, dan harga transparan.",
      image: "",
    };
    try {
      await upsertAbout(sample as { title: string; description: string; image: string });
      await qc.invalidateQueries({ queryKey: ["about"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_about", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, title: "", description: "", image: "" });
    } else {
      setEditing({ id: Date.now(), title: "", description: "", image: "" });
    }
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
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertAbout(editing as Partial<About> & { title: string; description: string; image: string });
        await qc.invalidateQueries({ queryKey: ["about"], exact: true });
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
        await deleteAbout(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["about"], exact: true });
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
      const data = (remote || []) as About[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_about")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          title: "Kenapa Memilih Kami?",
          description:
            "Tim profesional, peralatan modern, editing cinematic, tepat waktu, dan harga transparan.",
          image: "",
        },
      ]);
    }
  }, [remote, isError, seedExamples]);


  return (
    <AdminLayout title="About">
      <DataTable<About> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit About" : "Tambah About"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default AboutPage;
