import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteHero, listHero, upsertHero } from "@/admin/api/hero";

type Hero = { id: number; title: string; subtitle: string; background_image: string; cta_text: string };

const HeroPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Hero[]>([]);
  const [editing, setEditing] = useState<Hero | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Hero | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["hero"],
    queryFn: async () => listHero(),
    retry: false,
  });

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

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<Hero, "id"> = {
      title: "Abadikan Momen, Ceritakan Kisahmu Dengan Visual Berkualitas",
      subtitle: "Kami membantu Anda mengubah momen menjadi karya visual yang berkelas dan tak terlupakan.",
      background_image: "/src/assets/hero-bg.jpg",
      cta_text: "BOOKING SEKARANG",
    };
    try {
      await upsertHero(sample as { title: string; subtitle: string; background_image: string; cta_text: string });
      await qc.invalidateQueries({ queryKey: ["hero"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_hero", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  useEffect(() => {
    if (isSupabaseEnabled && !isError) {
      const data = (remote || []) as Hero[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_hero")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          title: "Abadikan Momen, Ceritakan Kisahmu Dengan Visual Berkualitas",
          subtitle: "Kami membantu Anda mengubah momen menjadi karya visual yang berkelas dan tak terlupakan.",
          background_image: "/src/assets/hero-bg.jpg",
          cta_text: "BOOKING SEKARANG",
        },
      ]);
    }
  }, [remote, isError, seedExamples]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, title: "", subtitle: "", background_image: "", cta_text: "" });
    } else {
      setEditing({ id: Date.now(), title: "", subtitle: "", background_image: "", cta_text: "" });
    }
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
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertHero(editing as Partial<Hero> & { title: string; subtitle: string; background_image: string; cta_text: string });
        await qc.invalidateQueries({ queryKey: ["hero"], exact: true });
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
        await deleteHero(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["hero"], exact: true });
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


  return (
    <AdminLayout title="Hero">
      <DataTable<Hero> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Hero" : "Tambah Hero"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default HeroPage;
