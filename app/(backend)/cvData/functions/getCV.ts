import { SupabaseClient } from "@supabase/supabase-js";
import { getUserId } from "./getUserId";

export async function getCV(supabaseClient: SupabaseClient, id: string) {
  const userId = await getUserId(supabaseClient);
  const { data: cvbaseData, error:  cvbaseDataError } = await supabaseClient
    .from("cv")
    .select("id, name, visibility, layoutConfigs, personalInformation, experience, education, skillGroups")
    .eq("id", id)
    .eq('userId', userId)
    .single();
  if (cvbaseDataError) {
    throw cvbaseDataError;
  }
  return {
    ...cvbaseData,
  };
}
