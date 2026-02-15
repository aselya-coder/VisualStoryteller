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

export const upsertPricing = async (row: Omit<PricingRow, "id"> & { id?: number }) => {
  if (!supabase) return { data: null } as any;
  const { data, error } = await supabase.from("pricing").upsert(row, { onConflict: "id" }).select();
  if (error) throw error;
  return data;
};

export const deletePricing = async (id: number) => {
  if (!supabase) return { data: null } as any;
  const { data, error } = await supabase.from("pricing").delete().eq("id", id).select();
  if (error) throw error;
  return data;
};

