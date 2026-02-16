import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteFooter, listFooter, upsertFooter } from "@/admin/api/footer";

type FooterItem = { id: number; address: string; email: string; phone: string; social_links: string[] };

const FooterPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<FooterItem[]>([]);
  const [editing, setEditing] = useState<FooterItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<FooterItem | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["footer"],
    queryFn: async () => listFooter(),
    retry: false,
  });

  const columns: Column<FooterItem>[] = [
    { key: "address", label: "Alamat" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Telepon" },
    { key: "social_links", label: "Social", render: (row) => (row.social_links || []).join(", ") },
  ];

  const fields = [
    { name: "address", label: "Alamat", type: "text" as const },
    { name: "email", label: "Email", type: "text" as const },
    { name: "phone", label: "Telepon", type: "text" as const },
    { name: "social_links", label: "Social Links", type: "array" as const },
  ];

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<FooterItem, "id"> = {
      address: "Jl. Kreatif No. 10, Jakarta Selatan",
      email: "admin@visualstoryteller.app",
      phone: "+62 856-4642-0488",
      social_links: ["@visual.studio"],
    };
    try {
      await upsertFooter(sample as { address: string; email: string; phone: string; social_links: string[] });
      await qc.invalidateQueries({ queryKey: ["footer"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_footer", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, address: "", email: "", phone: "", social_links: [] });
    } else {
      setEditing({ id: Date.now(), address: "", email: "", phone: "", social_links: [] });
    }
    setModalOpen(true);
  };
  const onEdit = (row: FooterItem) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: FooterItem) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertFooter(editing as Partial<FooterItem> & { address: string; email: string; phone: string; social_links: string[] });
        await qc.invalidateQueries({ queryKey: ["footer"], exact: true });
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
        await deleteFooter(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["footer"], exact: true });
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
      const data = (remote || []) as FooterItem[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_footer")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          address: "Jl. Kreatif No. 10, Jakarta Selatan",
          email: "admin@visualstoryteller.app",
          phone: "+62 856-4642-0488",
          social_links: ["@visual.studio"],
        },
      ]);
    }
  }, [remote, isError, seedExamples]);


  return (
    <AdminLayout title="Footer">
      <DataTable<FooterItem> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Footer" : "Tambah Footer"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default FooterPage;
