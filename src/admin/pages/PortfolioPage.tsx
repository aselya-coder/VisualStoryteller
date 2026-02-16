import { useEffect, useState, useCallback, useMemo } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deletePortfolio, listPortfolio, upsertPortfolio } from "@/admin/api/portfolio";

type Portfolio = { id: number; title: string; image: string; category: string; link: string };

const CATEGORY_ORDER = ["Wedding", "Event", "Corporate", "Personal"] as const;
const ORDER_INDEX: Record<string, number> = { Wedding: 0, Event: 1, Corporate: 2, Personal: 3 };

const PortfolioPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Portfolio[]>([]);
  const [editing, setEditing] = useState<Portfolio | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Portfolio | null>(null);

  const qc = useQueryClient();
  const { data: remote } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["portfolio"],
    queryFn: async () => listPortfolio(),
  });

  const categories = useMemo(() => {
    const uniq = Array.from(new Set(items.map((i) => i.category))).filter(Boolean);
    return uniq.sort((a, b) => {
      const ai = ORDER_INDEX[a];
      const bi = ORDER_INDEX[b];
      if (ai != null && bi != null) return ai - bi;
      if (ai != null) return -1;
      if (bi != null) return 1;
      return a.localeCompare(b);
    });
  }, [items]);

  const sortedItems = useMemo(() => {
    return items.slice().sort((a, b) => {
      const ai = ORDER_INDEX[a.category];
      const bi = ORDER_INDEX[b.category];
      if (ai != null && bi != null) {
        if (ai !== bi) return ai - bi;
        return (a.id ?? 0) - (b.id ?? 0);
      }
      if (ai != null) return -1;
      if (bi != null) return 1;
      const catCmp = a.category.localeCompare(b.category);
      if (catCmp !== 0) return catCmp;
      return (a.id ?? 0) - (b.id ?? 0);
    });
  }, [items]);

  const columns: Column<Portfolio>[] = [
    { key: "title", label: "Judul" },
    { key: "category", label: "Kategori" },
    { key: "link", label: "Link" },
  ];

  const fields = useMemo(() => {
    const options = categories.length > 0 ? categories : Array.from(CATEGORY_ORDER);
    return [
      { name: "title", label: "Judul", type: "text" as const },
      { name: "image", label: "Gambar", type: "image" as const },
      { name: "category", label: "Kategori", type: "select" as const, options },
      { name: "link", label: "Link", type: "text" as const },
    ];
  }, [categories]);

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const samples: Omit<Portfolio, "id">[] = [
      { title: "Wedding Golden Hour", image: "/src/assets/portfolio-wedding.jpg", category: "Wedding", link: "#" },
      { title: "Corporate Event Stage", image: "/src/assets/portfolio-event.jpg", category: "Event", link: "#" },
      { title: "Professional Portrait", image: "/src/assets/portfolio-corporate.jpg", category: "Corporate", link: "#" },
      { title: "Graduation Day", image: "/src/assets/portfolio-wisuda.jpg", category: "Personal", link: "#" },
      { title: "Creative Branding", image: "/src/assets/portfolio-personal.jpg", category: "Personal", link: "#" },
      { title: "Product Photography", image: "/src/assets/portfolio-product.jpg", category: "Corporate", link: "#" },
    ];
    try {
      for (const s of samples) {
        await upsertPortfolio(s as { title: string; image: string; category: string; link: string });
      }
      await qc.invalidateQueries({ queryKey: ["portfolio"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_portfolio", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  

  useEffect(() => {
    if (isSupabaseEnabled) {
      const data = (remote || []) as Portfolio[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_portfolio")) {
        seedExamples(true);
      }
    } else {
      setItems([
        { id: 1, title: "Wedding Golden Hour", image: "/src/assets/portfolio-wedding.jpg", category: "Wedding", link: "#" },
        { id: 2, title: "Corporate Event Stage", image: "/src/assets/portfolio-event.jpg", category: "Event", link: "#" },
        { id: 3, title: "Professional Portrait", image: "/src/assets/portfolio-corporate.jpg", category: "Corporate", link: "#" },
        { id: 4, title: "Graduation Day", image: "/src/assets/portfolio-wisuda.jpg", category: "Personal", link: "#" },
        { id: 5, title: "Creative Branding", image: "/src/assets/portfolio-personal.jpg", category: "Personal", link: "#" },
        { id: 6, title: "Product Photography", image: "/src/assets/portfolio-product.jpg", category: "Corporate", link: "#" },
      ]);
    }
  }, [remote, seedExamples]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, title: "", image: "", category: "", link: "" });
    } else {
      setEditing({ id: Date.now(), title: "", image: "", category: "", link: "" });
    }
    setModalOpen(true);
  };
  const onEdit = (row: Portfolio) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Portfolio) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertPortfolio(editing as Partial<Portfolio> & { title: string; image: string; category: string; link: string });
        await qc.invalidateQueries({ queryKey: ["portfolio"], exact: true });
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
        await deletePortfolio(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["portfolio"], exact: true });
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
    <AdminLayout title="Portfolio">
      <DataTable<Portfolio> data={sortedItems} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} filter={{ key: "category", options: categories }} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Portfolio" : "Tambah Portfolio"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default PortfolioPage;
