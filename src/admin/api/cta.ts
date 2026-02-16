import { supabase } from "@/lib/supabaseClient";

export type CTARow = {
  id: number;
  title: string;
  subtitle: string;
  button_text: string;
};

export const listCTA = async (): Promise<CTARow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cta")
    .select("id,title,subtitle,button_text")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertCTA = async (
  row: Partial<CTARow> & { title: string; subtitle: string; button_text: string },
): Promise<CTARow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as CTARow;
  if (id == null) {
    const { data, error } = await supabase.from("cta").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("cta").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteCTA = async (id: number): Promise<CTARow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("cta").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
