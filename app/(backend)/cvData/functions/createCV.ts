import { SupabaseClient } from "@supabase/supabase-js";
import { getUserId } from "./getUserId";

export async function createCV(supabaseClient: SupabaseClient) {
  const userId = await getUserId(supabaseClient);
  const insertData = {
    userId: userId,
    visibility: "draft",
    updatedAt: new Date().toISOString(),
    layoutConfigs: {
      templateId: 0,
      colorId: 0,
      fontId: 0,
      fontSizeId: 11,
    },
    personalInformation: {
      name: "",
      surname: "",
      profileUrl: "",
      birthdate: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      xing: "",
      website: "",
      professionalTitle: "",
      summary: "",
    },
    experience: [],
    education: [],
    skillGroups: [],
  };
  
  const { data, error } = await supabaseClient
    .from("cv")
    .insert(insertData)
    .select()
    .single();
  if (error) throw error;
  return data;
}
