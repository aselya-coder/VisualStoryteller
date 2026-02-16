import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteNavbar, listNavbar, upsertNavbar } from "@/admin/api/navbar";

type NavbarItem = { id: number; logo_url: string; menu: string[] };

const NavbarPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<NavbarItem[]>([]);
  const [editing, setEditing] = useState<NavbarItem | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<NavbarItem | null>(null);

  const qc = useQueryClient();
  const { data: remote, isError } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["navbar"],
    queryFn: async () => listNavbar(),
    retry: false,
  });

  const columns: Column<NavbarItem>[] = [
    { key: "logo_url", label: "Logo" },
    { key: "menu", label: "Menu", render: (row) => (row.menu || []).join(", ") },
  ];

  const fields = [
    { name: "logo_url", label: "Logo URL", type: "text" as const },
    { name: "menu", label: "Menu", type: "array" as const },
  ];

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const sample: Omit<NavbarItem, "id"> = {
      logo_url: "",
      menu: ["Beranda", "Tentang", "Layanan", "Portofolio", "Harga", "Testimoni", "Kontak"],
    };
    try {
      await upsertNavbar(sample as { logo_url: string; menu: string[] });
      await qc.invalidateQueries({ queryKey: ["navbar"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_navbar", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  useEffect(() => {
    if (isSupabaseEnabled && !isError) {
      const data = (remote || []) as NavbarItem[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_navbar")) {
        seedExamples(true);
      }
    } else {
      setItems([
        {
          id: 1,
          logo_url: "",
          menu: ["Beranda", "Tentang", "Layanan", "Portofolio", "Harga", "Testimoni", "Kontak"],
        },
      ]);
    }
  }, [remote, isError, seedExamples]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, logo_url: "", menu: [] });
    } else {
      setEditing({ id: Date.now(), logo_url: "", menu: [] });
    }
    setModalOpen(true);
  };
  const onEdit = (row: NavbarItem) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: NavbarItem) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertNavbar(editing as Partial<NavbarItem> & { logo_url: string; menu: string[] });
        await qc.invalidateQueries({ queryKey: ["navbar"], exact: true });
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
        await deleteNavbar(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["navbar"], exact: true });
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
    <AdminLayout title="Navbar">
      <DataTable<NavbarItem> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Navbar" : "Tambah Navbar"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default NavbarPage;
