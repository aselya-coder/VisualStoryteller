import { supabase } from "@/lib/supabaseClient";

export type PortfolioRow = {
  id: number;
  title: string;
  image: string;
  category: string;
  link: string;
};

export const listPortfolio = async (): Promise<PortfolioRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("portfolio")
    .select("id,title,image,category,link")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertPortfolio = async (
  row: Partial<PortfolioRow> & { title: string; image: string; category: string; link: string },
): Promise<PortfolioRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as PortfolioRow;
  if (id == null) {
    const { data, error } = await supabase.from("portfolio").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("portfolio").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deletePortfolio = async (id: number): Promise<PortfolioRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("portfolio").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
