import { supabase } from "@/lib/supabaseClient";

export type AboutRow = {
  id: number;
  title: string;
  description: string;
  image: string;
};

export const listAbout = async (): Promise<AboutRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("about")
    .select("id,title,description,image")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertAbout = async (
  row: Partial<AboutRow> & { title: string; description: string; image: string },
): Promise<AboutRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as AboutRow;
  if (id == null) {
    const { data, error } = await supabase.from("about").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("about").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteAbout = async (id: number): Promise<AboutRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("about").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
