import { useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export type Column<T> = { key: keyof T; label: string; render?: (row: T) => React.ReactNode };

type Filter<T> = { key: keyof T; options: string[] };

const DataTable = <T extends { id?: string | number }>({ data, columns, onAdd, onEdit, onDelete, filter }: { data: T[]; columns: Column<T>[]; onAdd: () => void; onEdit: (row: T) => void; onDelete: (row: T) => void; filter?: Filter<T> }) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState<string>("All");
  const pageSize = 10;
  const filtered = useMemo(() => {
    if (!query) return data;
    const q = query.toLowerCase();
    return data.filter((row) =>
      Object.values(row as unknown as Record<string, unknown>).some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [data, query]);
  const filteredByOption = useMemo(() => {
    if (!filter || filterValue === "All") return filtered;
    return filtered.filter((row) => String(row[filter.key]) === filterValue);
  }, [filtered, filter, filterValue]);
  const totalPages = Math.max(1, Math.ceil(filteredByOption.length / pageSize));
  const paged = filteredByOption.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input placeholder="Cari" value={query} onChange={(e) => setQuery(e.target.value)} className="max-w-xs" />
        {filter && (
          <select className="h-9 rounded border px-2" value={filterValue} onChange={(e) => setFilterValue(e.target.value)}>
            <option>All</option>
            {filter.options.map((opt) => (
              <option key={opt}>{opt}</option>
            ))}
          </select>
        )}
        <Button onClick={onAdd}>Tambah</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((c) => (
              <TableHead key={String(c.key)}>{c.label}</TableHead>
            ))}
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paged.map((row, idx) => (
            <TableRow key={String(row.id ?? idx)}>
              {columns.map((c) => (
                <TableCell key={String(c.key)}>{c.render ? c.render(row) : String(row[c.key])}</TableCell>
              ))}
              <TableCell className="space-x-2">
                <Button variant="outline" onClick={() => onEdit(row)}>
                  Edit
                </Button>
                <Button variant="destructive" onClick={() => onDelete(row)}>
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Prev
        </Button>
        <span>
          {page} / {totalPages}
        </span>
        <Button variant="outline" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
