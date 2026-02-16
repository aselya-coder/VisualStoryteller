import { supabase } from "@/lib/supabaseClient";

export type TestimonialRow = {
  id: number;
  client_name: string;
  photo: string;
  message: string;
  rating: number;
};

export const listTestimonials = async (): Promise<TestimonialRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("testimonials")
    .select("id,client_name,photo,message,rating")
    .order("id", { ascending: true });
  if (error) throw error;
  return data ?? [];
};

export const upsertTestimonial = async (
  row: Partial<TestimonialRow> & { client_name: string; photo: string; message: string; rating: number },
): Promise<TestimonialRow[]> => {
  if (!supabase) return [];
  const { id, ...rest } = row as TestimonialRow;
  if (id == null) {
    const { data, error } = await supabase.from("testimonials").insert(rest).select();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase.from("testimonials").upsert({ id, ...rest }, { onConflict: "id" }).select();
  if (error) throw error;
  return data ?? [];
};

export const deleteTestimonial = async (id: number): Promise<TestimonialRow[]> => {
  if (!supabase) return [];
  const { data, error } = await supabase.from("testimonials").delete().eq("id", id).select();
  if (error) throw error;
  return data ?? [];
};
