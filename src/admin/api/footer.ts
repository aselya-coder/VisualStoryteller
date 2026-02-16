import { supabase } from "@/lib/supabaseClient";

export type FooterRow = {
  id: number;
  address: string;
  email: string;
  phone: string;
  social_links: string[];
};

export const listFooter = async (): Promise<FooterRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("footer")
    .select("id,address,email,phone,social_links")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertFooter = async (
  row: Partial<FooterRow> & { address: string; email: string; phone: string; social_links: string[] },
): Promise<FooterRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as FooterRow;
  if (id == null) {
    const { data, error } = await supabase.from("footer").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("footer").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteFooter = async (id: number): Promise<FooterRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("footer").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
