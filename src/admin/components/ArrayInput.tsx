import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ArrayInput = ({ value = [], onChange, placeholder }: { value?: string[]; onChange: (v: string[]) => void; placeholder?: string }) => {
  const [items, setItems] = useState<string[]>(value);

  const set = (next: string[]) => {
    setItems(next);
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <Input value={it} onChange={(e) => set(items.map((v, idx) => (idx === i ? e.target.value : v)))} placeholder={placeholder} />
          <Button variant="destructive" type="button" onClick={() => set(items.filter((_, idx) => idx !== i))}>Hapus</Button>
        </div>
      ))}
      <Button type="button" onClick={() => set([...items, ""])}>Tambah</Button>
    </div>
  );
};

export default ArrayInput;

