import { CvData } from "@/schemas/cv_data_schema";
import { createClient } from "@/utils/supabase/client";

// Fetch ALL (collection)
export async function fetchAllCvs(): Promise<CvData[]> {
  const sb = createClient();
  const { data, error } = await sb.functions.invoke("restful-api/cv", {
    method: "GET",
  });
  if (error) throw error;
  return (data as { items: CvData[] }).items;
}

// Single-item CRUD (server owns timestamps)
export async function createEmptyCv(): Promise<{ id: string }> {
  const sb = createClient();
  const { data, error } = await sb.functions.invoke("restful-api/cv", {
    body: {},
  });
  if (error) throw error;
  return data as { id: string };
}

export async function updateCv(item: CvData): Promise<void> {
  const sb = createClient();
  const { error } = await sb.functions.invoke("cv-update", { body: { item } });
  if (error) throw error;
}

export async function deleteCv(id: string): Promise<void> {
  const sb = createClient();
  const { error } = await sb.functions.invoke("restful-api/cv/"+id, { method: 'DELETE' });
  if (error) {
    console.log(error);
    throw error
  }
}

export function shareCV(id: string): void {
  let host = location.hostname;
  const port = location.port;
  if(port){
    host += ':' + port;
  }
  let shareLink;
  if(host.startsWith('localhost')){
    shareLink = 'http://'+host+'/view/'+id
  } else {
    shareLink = 'https://'+host+'/view/'+id
  }
  navigator.clipboard.writeText(shareLink)
  alert(shareLink); // TODO replace with toast
}