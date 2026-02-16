import { supabase } from "@/lib/supabaseClient";

export type ProcessRow = {
  id: number;
  step_number: number;
  title: string;
  description: string;
};

export const listProcess = async (): Promise<ProcessRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("process")
    .select("id,step_number,title,description")
    .order("step_number", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertProcess = async (
  row: Partial<ProcessRow> & { step_number: number; title: string; description: string },
): Promise<ProcessRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as ProcessRow;
  if (id == null) {
    const { data, error } = await supabase.from("process").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("process").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteProcess = async (id: number): Promise<ProcessRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("process").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
