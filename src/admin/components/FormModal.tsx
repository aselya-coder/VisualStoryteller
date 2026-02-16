import { useEffect } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ImageUploadPreview from "@/admin/components/ImageUploadPreview";
import ArrayInput from "@/admin/components/ArrayInput";
import RatingInput from "@/admin/components/RatingInput";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Field = {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "image" | "array" | "rating" | "select";
  options?: string[];
};

const FormModal = <T extends Record<string, unknown>>({ open, onOpenChange, title, fields, value, onChange, onSubmit }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; fields: Field[]; value: T | null; onChange: (next: T) => void; onSubmit: () => void }) => {
  useEffect(() => {}, [open]);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>Lengkapi form lalu simpan.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {fields.map((f) => {
            const v = (value as Record<string, unknown>)?.[f.name] ?? "";
            if (f.type === "textarea")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <Textarea value={v as string} onChange={(e) => onChange({ ...(value as T), [f.name]: e.target.value } as T)} />
                </div>
              );
            if (f.type === "number")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <Input type="number" value={v as number} onChange={(e) => onChange({ ...(value as T), [f.name]: Number(e.target.value) } as T)} />
                </div>
              );
            if (f.type === "image")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <ImageUploadPreview value={v as string} onChange={(nv) => onChange({ ...(value as T), [f.name]: nv } as T)} />
                </div>
              );
            if (f.type === "array")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <ArrayInput value={Array.isArray(v) ? (v as string[]) : []} onChange={(nv) => onChange({ ...(value as T), [f.name]: nv } as T)} />
                </div>
              );
            if (f.type === "rating")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <RatingInput value={Number(v) || 0} onChange={(nv) => onChange({ ...(value as T), [f.name]: nv } as T)} />
                </div>
              );
            if (f.type === "select")
              return (
                <div key={f.name} className="space-y-2">
                  <label className="text-sm font-medium">{f.label}</label>
                  <Select value={String(v)} onValueChange={(nv) => onChange({ ...(value as T), [f.name]: nv } as T)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      {(f.options || []).map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              );
            return (
              <div key={f.name} className="space-y-2">
                <label className="text-sm font-medium">{f.label}</label>
                <Input value={v as string} onChange={(e) => onChange({ ...(value as T), [f.name]: e.target.value } as T)} />
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={onSubmit}>Simpan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FormModal;
