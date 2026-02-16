import { supabase } from "@/lib/supabaseClient";

export type WhatsAppRow = {
  id: number;
  phone: string;
  default_message: string;
};

export const listWhatsApp = async (): Promise<WhatsAppRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("whatsapp_settings")
    .select("id,phone,default_message")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertWhatsApp = async (
  row: Partial<WhatsAppRow> & { phone: string; default_message: string },
): Promise<WhatsAppRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as WhatsAppRow;
  if (id == null) {
    const { data, error } = await supabase.from("whatsapp_settings").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("whatsapp_settings").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteWhatsApp = async (id: number): Promise<WhatsAppRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("whatsapp_settings").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
