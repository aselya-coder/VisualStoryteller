import { useState } from "react";
import { Star } from "lucide-react";

const RatingInput = ({ value = 0, onChange, max = 5 }: { value?: number; onChange: (v: number) => void; max?: number }) => {
  const [v, setV] = useState<number>(value);
  const set = (n: number) => {
    setV(n);
    onChange(n);
  };
  return (
    <div className="flex gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <button key={i} onClick={() => set(i + 1)} type="button">
          <Star className={i < v ? "text-yellow-500" : "text-muted-foreground"} />
        </button>
      ))}
    </div>
  );
};

export default RatingInput;

