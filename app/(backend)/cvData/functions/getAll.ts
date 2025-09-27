import { SupabaseClient } from "@supabase/supabase-js";
import { getUserId } from "./getUserId";

export async function getAll(supabaseClient: SupabaseClient) {
  const userId = await getUserId(supabaseClient);
  const { data, error } = await supabaseClient
    .from("cv")
    .select("id, createdAt, updatedAt, userId, visibility, name").eq('userId',userId)
    .order("createdAt", {
      ascending: true,
    });
  if (error) {
    console.log(error);
    throw error;
  }
  return new Response(
    JSON.stringify(
      data
    ),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    }
  );
}