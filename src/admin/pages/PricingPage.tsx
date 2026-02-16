import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deletePricing, listPricing, upsertPricing } from "@/admin/api/pricing";

type Pricing = { id: number; name: string; price: number; features: string[] };

const PricingPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Pricing[]>([]);
  const [editing, setEditing] = useState<Pricing | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Pricing | null>(null);
  const qc = useQueryClient();
  const { data: remote, isLoading } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["pricing"],
    queryFn: async () => listPricing(),
  });
  

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

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const samples: Omit<Pricing, "id">[] = [
      { name: "Silver", price: 1500000, features: ["1 Fotografer", "3 Jam Sesi", "50 Foto Edit", "File Digital HD", "Delivery 5 Hari"] },
      { name: "Gold", price: 3500000, features: ["1 Foto + 1 Videografer", "5 Jam Sesi", "1 Video Highlight", "100 Foto Edit", "File Digital HD", "Delivery 7 Hari"] },
      { name: "Platinum", price: 7500000, features: ["Full Team", "8 Jam Sesi", "Cinematic Video", "Drone Coverage", "Unlimited Foto Edit", "File 4K", "Delivery 14 Hari"] },
    ];
    try {
      for (const s of samples) {
        await upsertPricing(s);
      }
      await qc.invalidateQueries({ queryKey: ["pricing"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_pricing", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  useEffect(() => {
    if (isSupabaseEnabled) {
      const data = (remote || []) as Pricing[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_pricing")) {
        seedExamples(true);
      }
    } else {
      setItems([
        { id: 1, name: "Silver", price: 1500000, features: ["1 Fotografer", "3 Jam Sesi", "50 Foto Edit", "File Digital HD", "Delivery 5 Hari"] },
        { id: 2, name: "Gold", price: 3500000, features: ["1 Foto + 1 Videografer", "5 Jam Sesi", "1 Video Highlight", "100 Foto Edit", "File Digital HD", "Delivery 7 Hari"] },
        { id: 3, name: "Platinum", price: 7500000, features: ["Full Team", "8 Jam Sesi", "Cinematic Video", "Drone Coverage", "Unlimited Foto Edit", "File 4K", "Delivery 14 Hari"] },
      ]);
    }
  }, [remote, seedExamples]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, name: "", price: 0, features: [] });
    } else {
      setEditing({ id: Date.now(), name: "", price: 0, features: [] });
    }
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
  const mutateSave = useMutation({
    mutationFn: async (row: Pricing) => upsertPricing(row),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["pricing"], exact: true });
      toast({ title: "Tersimpan" });
    },
    onError: (e: unknown) => toast({ title: "Gagal menyimpan", description: e instanceof Error ? e.message : String(e) }),
  });
  const save = () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      mutateSave.mutate(editing);
    } else {
      setItems((prev) => {
        const idx = prev.findIndex((p) => p.id === editing.id);
        if (idx >= 0) return prev.map((p) => (p.id === editing.id ? editing : p));
        return [...prev, editing];
      });
      toast({ title: "Tersimpan" });
    }
    setModalOpen(false);
  };
  const mutateDelete = useMutation({
    mutationFn: async (id: number) => deletePricing(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["pricing"], exact: true });
      toast({ title: "Terhapus" });
    },
    onError: (e: unknown) => toast({ title: "Gagal menghapus", description: e instanceof Error ? e.message : String(e) }),
  });
  const confirmDelete = () => {
    if (!toDelete) return;
    if (isSupabaseEnabled) {
      mutateDelete.mutate(toDelete.id);
    } else {
      setItems((prev) => prev.filter((p) => p.id !== toDelete.id));
      toast({ title: "Terhapus" });
    }
    setConfirmOpen(false);
  };


  return (
    <AdminLayout title="Pricing">
      <DataTable<Pricing> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isLoading && <div className="mt-2 text-sm text-muted-foreground">Memuat dari Supabase...</div>}
      {isSupabaseEnabled && !isLoading && items.length === 0 && (
        <div className="mt-3 flex items-center justify-between rounded border p-3 text-sm">
          <span>Belum ada data di Supabase. Tambahkan lewat tombol di atas atau isi contoh.</span>
          <Button size="sm" onClick={() => seedExamples()}>Isi data contoh</Button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Pricing" : "Tambah Pricing"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default PricingPage;
