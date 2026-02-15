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

export const upsertService = async (row: Omit<ServiceRow, "id"> & { id?: number }) => {
  if (!supabase) return { data: null } as any;
  const { data, error } = await supabase.from("services").upsert(row, { onConflict: "id" }).select();
  if (error) throw error;
  return data;
};

export const deleteService = async (id: number) => {
  if (!supabase) return { data: null } as any;
  const { data, error } = await supabase.from("services").delete().eq("id", id).select();
  if (error) throw error;
  return data;
};

