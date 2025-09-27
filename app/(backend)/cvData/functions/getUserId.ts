import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserId(supabaseClient: SupabaseClient) {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) throw error;
  return data.user.id;
}
