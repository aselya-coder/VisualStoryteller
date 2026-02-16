import { supabase } from "@/lib/supabaseClient";

export type ServiceRow = {
  id: number;
  name: string;
  description: string;
  icon: string;
};

export const listServices = async (): Promise<ServiceRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("services").select("id,name,description,icon").order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertService = async (
  row: Partial<ServiceRow> & { name: string; description: string; icon: string },
): Promise<ServiceRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as ServiceRow;
  if (id == null) {
    const { data, error } = await supabase.from("services").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("services").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteService = async (id: number): Promise<ServiceRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("services").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
