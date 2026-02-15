import { useEffect, useMemo, useState } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteService, listServices, upsertService } from "@/admin/api/services";

type Service = { id: number; name: string; description: string; icon: string };

const ServicesPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Service | null>(null);
  const qc = useQueryClient();
  const { data: remote, isLoading } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["services"],
    queryFn: async () => listServices(),
  });
  useEffect(() => {
    if (isSupabaseEnabled) {
      setItems((remote || []) as Service[]);
    } else {
      setItems([
        {
          id: 1,
          name: "Photography",
          description: "Wedding, Wisuda, Event, Produk, Company Profile",
          icon: "Camera",
        },
        {
          id: 2,
          name: "Videography",
          description:
            "Wedding Cinematic, Event Highlight, Company Profile Video, Konten Sosial Media, Reels & TikTok",
          icon: "Video",
        },
        {
          id: 3,
          name: "Editing Service",
          description:
            "Editing Video Mentah, Color Grading Cinematic, Retouching Foto, Short Video Ads, Motion Graphic",
          icon: "Scissors",
        },
      ]);
    }
  }, [remote]);

  const columns: Column<Service>[] = [
    { key: "name", label: "Nama" },
    { key: "description", label: "Deskripsi" },
    { key: "icon", label: "Icon" },
  ];

  const fields = [
    { name: "name", label: "Nama", type: "text" as const },
    { name: "description", label: "Deskripsi", type: "textarea" as const },
    { name: "icon", label: "Icon", type: "text" as const },
  ];

  const onAdd = () => {
    setEditing({ id: Date.now(), name: "", description: "", icon: "" });
    setModalOpen(true);
  };
  const onEdit = (row: Service) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Service) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const mutateSave = useMutation({
    mutationFn: async (row: Service) => upsertService(row),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["services"], exact: true });
      toast({ title: "Tersimpan" });
    },
    onError: (e: any) => toast({ title: "Gagal menyimpan", description: String(e.message || e) }),
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
    mutationFn: async (id: number) => deleteService(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["services"], exact: true });
      toast({ title: "Terhapus" });
    },
    onError: (e: any) => toast({ title: "Gagal menghapus", description: String(e.message || e) }),
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

  const seedExamples = async () => {
    if (!isSupabaseEnabled) return;
    const samples: Omit<Service, "id">[] = [
      { name: "Photography", description: "Wedding, Wisuda, Event, Produk, Company Profile", icon: "Camera" },
      {
        name: "Videography",
        description: "Wedding Cinematic, Event Highlight, Company Profile Video, Konten Sosial Media, Reels & TikTok",
        icon: "Video",
      },
      {
        name: "Editing Service",
        description: "Editing Video Mentah, Color Grading Cinematic, Retouching Foto, Short Video Ads, Motion Graphic",
        icon: "Scissors",
      },
    ];
    try {
      for (const s of samples) {
        await upsertService(s as any);
      }
      await qc.invalidateQueries({ queryKey: ["services"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
    } catch (e: any) {
      toast({ title: "Gagal menambahkan", description: String(e.message || e) });
    }
  };

  return (
    <AdminLayout title="Services">
      <DataTable<Service> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isLoading && <div className="mt-2 text-sm text-muted-foreground">Memuat dari Supabase...</div>}
      {isSupabaseEnabled && !isLoading && items.length === 0 && (
        <div className="mt-3 flex items-center justify-between rounded border p-3 text-sm">
          <span>Belum ada data di Supabase. Tambahkan lewat tombol di atas atau isi contoh.</span>
          <Button size="sm" onClick={seedExamples}>Isi data contoh</Button>
        </div>
      )}
      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={editing && items.some((i) => i.id === editing.id) ? "Edit Service" : "Tambah Service"}
        fields={fields}
        value={editing}
        onChange={(v) => setEditing(v)}
        onSubmit={save}
      />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default ServicesPage;
