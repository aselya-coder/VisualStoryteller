import { supabase } from "@/lib/supabaseClient";

export type HeroRow = {
  id: number;
  title: string;
  subtitle: string;
  background_image: string;
  cta_text: string;
};

export const listHero = async (): Promise<HeroRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("hero")
    .select("id,title,subtitle,background_image,cta_text")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertHero = async (
  row: Partial<HeroRow> & { title: string; subtitle: string; background_image: string; cta_text: string },
): Promise<HeroRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as HeroRow;
  if (id == null) {
    const { data, error } = await supabase.from("hero").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("hero").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteHero = async (id: number): Promise<HeroRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("hero").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
