import { supabase } from "@/lib/supabaseClient";

export type PricingRow = {
  id: number;
  name: string;
  price: number;
  features: string[];
};

export const listPricing = async (): Promise<PricingRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("pricing").select("id,name,price,features").order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertPricing = async (
  row: Partial<PricingRow> & { name: string; price: number; features: string[] },
): Promise<PricingRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as PricingRow;
  if (id == null) {
    const { data, error } = await supabase.from("pricing").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("pricing").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deletePricing = async (id: number): Promise<PricingRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("pricing").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
