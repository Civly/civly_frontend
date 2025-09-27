import { SupabaseClient } from "@supabase/supabase-js";

export async function deleteCV(supabaseClient: SupabaseClient, id: string) {
  const { error } = await supabaseClient.from("cv").delete().eq("id", id);
  if (error) throw error;
}
