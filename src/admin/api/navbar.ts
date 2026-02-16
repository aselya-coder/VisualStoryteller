import { supabase } from "@/lib/supabaseClient";

export type NavbarRow = {
  id: number;
  logo_url: string;
  menu: string[];
};

export const listNavbar = async (): Promise<NavbarRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("navbar")
    .select("id,logo_url,menu")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertNavbar = async (
  row: Partial<NavbarRow> & { logo_url: string; menu: string[] },
): Promise<NavbarRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as NavbarRow;
  if (id == null) {
    const { data, error } = await supabase.from("navbar").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("navbar").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteNavbar = async (id: number): Promise<NavbarRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("navbar").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
