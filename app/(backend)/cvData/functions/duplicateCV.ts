import { SupabaseClient } from "@supabase/supabase-js";
import { getCV } from "./getCV";
import { getUserId } from "./getUserId";

export async function duplicateCV(supabaseClient: SupabaseClient, id: string) {
  const userId = await getUserId(supabaseClient);
  const cv = await getCV(supabaseClient, id);
  if(!cv){
    throw new Error('cv not found');
  }

  const { data: cvData, error: cvinsertError } = await supabaseClient
    .from("cv")
    .insert({
      userId: userId,
      visibility: "draft",
      name: cv.name + " COPY",
      updatedAt: new Date().toISOString(),
      layoutConfigs: cv.layoutConfigs,
      personalInformation: cv.personalInformation,
      experience: cv.experience,
      education: cv.education,
      skillGroups: cv.skillGroups
    })
    .select()
    .single();
  if (cvinsertError) throw cvinsertError;

  return {
      id: cvData.id,
      name: cvData.name,
      createdAt: cvData.createdAt,
    };
}
