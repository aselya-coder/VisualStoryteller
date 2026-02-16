import { useEffect, useState, useCallback } from "react";
import AdminLayout from "@/admin/layout/AdminLayout";
import DataTable, { type Column } from "@/admin/components/DataTable";
import FormModal from "@/admin/components/FormModal";
import ConfirmDialog from "@/admin/components/ConfirmDialog";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isSupabaseEnabled } from "@/lib/supabaseClient";
import { deleteTestimonial, listTestimonials, upsertTestimonial } from "@/admin/api/testimonials";

type Testimonial = { id: number; client_name: string; photo: string; message: string; rating: number };

const TestimonialsPage = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Testimonial | null>(null);

  const qc = useQueryClient();
  const { data: remote } = useQuery({
    enabled: isSupabaseEnabled,
    queryKey: ["testimonials"],
    queryFn: async () => listTestimonials(),
  });

  const columns: Column<Testimonial>[] = [
    { key: "client_name", label: "Klien" },
    { key: "message", label: "Pesan" },
    { key: "rating", label: "Rating" },
  ];

  const fields = [
    { name: "client_name", label: "Nama Klien", type: "text" as const },
    { name: "photo", label: "Foto", type: "image" as const },
    { name: "message", label: "Pesan", type: "textarea" as const },
    { name: "rating", label: "Rating", type: "rating" as const },
  ];

  const seedExamples = useCallback(async (markSeeded = false) => {
    if (!isSupabaseEnabled) return;
    const samples: Omit<Testimonial, "id">[] = [
      { client_name: "Sarah & Andi", photo: "", message: "Hasil video wedding kami luar biasa! Tim sangat profesional dan hasilnya melebihi ekspektasi. Setiap momen terabadikan dengan sempurna.", rating: 5 },
      { client_name: "Budi Santoso", photo: "", message: "Company profile video yang dihasilkan sangat berkualitas. Editing cinematic-nya membuat brand kami terlihat premium dan profesional.", rating: 5 },
      { client_name: "Anisa Putri", photo: "", message: "Foto wisuda saya jadi kenangan terbaik! Fotografernya sangat sabar dan kreatif dalam mengarahkan pose. Hasilnya amazing!", rating: 5 },
      { client_name: "PT. Maju Bersama", photo: "", message: "Sudah 3 kali menggunakan jasa mereka untuk event perusahaan. Selalu puas dengan hasilnya. Highly recommended!", rating: 5 },
    ];
    try {
      for (const s of samples) {
        await upsertTestimonial(s as { client_name: string; photo: string; message: string; rating: number });
      }
      await qc.invalidateQueries({ queryKey: ["testimonials"], exact: true });
      toast({ title: "Data contoh ditambahkan" });
      if (markSeeded) localStorage.setItem("seeded_testimonials", "true");
    } catch (e: unknown) {
      toast({ title: "Gagal menambahkan", description: e instanceof Error ? e.message : String(e) });
    }
  }, [qc, toast]);

  const onAdd = () => {
    if (isSupabaseEnabled) {
      setEditing({ id: undefined as unknown as number, client_name: "", photo: "", message: "", rating: 0 });
    } else {
      setEditing({ id: Date.now(), client_name: "", photo: "", message: "", rating: 0 });
    }
    setModalOpen(true);
  };
  const onEdit = (row: Testimonial) => {
    setEditing({ ...row });
    setModalOpen(true);
  };
  const onDelete = (row: Testimonial) => {
    setToDelete(row);
    setConfirmOpen(true);
  };
  const save = async () => {
    if (!editing) return;
    if (isSupabaseEnabled) {
      try {
        await upsertTestimonial(editing as Partial<Testimonial> & { client_name: string; photo: string; message: string; rating: number });
        await qc.invalidateQueries({ queryKey: ["testimonials"], exact: true });
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
        await deleteTestimonial(toDelete.id);
        await qc.invalidateQueries({ queryKey: ["testimonials"], exact: true });
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
    if (isSupabaseEnabled) {
      const data = (remote || []) as Testimonial[];
      setItems(data);
      if ((data?.length || 0) === 0 && !localStorage.getItem("seeded_testimonials")) {
        seedExamples(true);
      }
    } else {
      setItems([
        { id: 1, client_name: "Sarah & Andi", photo: "", message: "Hasil video wedding kami luar biasa! Tim sangat profesional dan hasilnya melebihi ekspektasi. Setiap momen terabadikan dengan sempurna.", rating: 5 },
        { id: 2, client_name: "Budi Santoso", photo: "", message: "Company profile video yang dihasilkan sangat berkualitas. Editing cinematic-nya membuat brand kami terlihat premium dan profesional.", rating: 5 },
        { id: 3, client_name: "Anisa Putri", photo: "", message: "Foto wisuda saya jadi kenangan terbaik! Fotografernya sangat sabar dan kreatif dalam mengarahkan pose. Hasilnya amazing!", rating: 5 },
        { id: 4, client_name: "PT. Maju Bersama", photo: "", message: "Sudah 3 kali menggunakan jasa mereka untuk event perusahaan. Selalu puas dengan hasilnya. Highly recommended!", rating: 5 },
      ]);
    }
  }, [remote, seedExamples]);

  return (
    <AdminLayout title="Testimonials">
      <DataTable<Testimonial> data={items} columns={columns} onAdd={onAdd} onEdit={onEdit} onDelete={onDelete} />
      {isSupabaseEnabled && (
        <div className="mt-2">
          <button className="inline-flex items-center justify-center rounded-md border px-3 py-1 text-sm" onClick={() => seedExamples()}>Isi data contoh</button>
        </div>
      )}
      <FormModal open={modalOpen} onOpenChange={setModalOpen} title={editing && items.some((i) => i.id === editing.id) ? "Edit Testimonial" : "Tambah Testimonial"} fields={fields} value={editing} onChange={(v) => setEditing(v)} onSubmit={save} />
      <ConfirmDialog open={confirmOpen} onOpenChange={setConfirmOpen} title="Hapus item?" onConfirm={confirmDelete} />
    </AdminLayout>
  );
};

export default TestimonialsPage;
