import { getUserId } from "./getUserId";
import { validateCV } from "./validate";
import { CvData } from "../schema/cvDataSchema";
import { SupabaseClient } from "@supabase/supabase-js";

export async function patchCV(supabaseClient: SupabaseClient, id: string, cv: CvData) {
  const userId = await getUserId(supabaseClient);
  const parsedCV = validateCV(cv);

  //Update
  const { error: cvupdateError } = await supabaseClient
    .from("cv")
    .update(parsedCV.password ?{
      name: parsedCV.name,
      visibility: parsedCV.visibility,
      password: parsedCV.password,
    }:
    {
      name: parsedCV.name,
      visibility: parsedCV.visibility,
      password: null
    })
    .eq("id", id).eq('userId', userId);
  if (cvupdateError) throw cvupdateError;

  return parsedCV;
}
