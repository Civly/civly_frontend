import { getUserId } from "./getUserId";
import { validateCV } from "./validate";
import { CvData } from "../schema/cvDataSchema";
import { SupabaseClient } from "@supabase/supabase-js";

export async function updateCV(supabaseClient: SupabaseClient, id: string, cv: CvData) {
  const userId = await getUserId(supabaseClient);
  const parsedCV = validateCV(cv);

  //Update
  const { error: cvupdateError } = await supabaseClient
    .from("cv")
    .update(parsedCV.password ?{
      name: parsedCV.name,
      password: parsedCV.password,
      layoutConfigs: parsedCV.layoutConfigs,
      personalInformation: parsedCV.personalInformation,
      experience: parsedCV.experience,
      education: parsedCV.education,
      skillGroups: parsedCV.skillGroups,
      updatedAt: new Date().toISOString(),
    }:
    {
      name: parsedCV.name,
      layoutConfigs: parsedCV.layoutConfigs,
      personalInformation: parsedCV.personalInformation,
      experience: parsedCV.experience,
      education: parsedCV.education,
      skillGroups: parsedCV.skillGroups,
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id)
    .eq('userId',userId);
  if (cvupdateError) throw cvupdateError;

  return parsedCV;
}
