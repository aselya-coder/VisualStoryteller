import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

const ImageUploadPreview = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  const [preview, setPreview] = useState<string | undefined>(value);

  useEffect(() => {
    setPreview(value);
  }, [value]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setPreview(url);
      onChange(url);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Input type="file" accept="image/*" onChange={handleFile} />
      {preview && <img src={preview} alt="preview" className="h-24 w-24 object-cover rounded" />}
    </div>
  );
};

export default ImageUploadPreview;

