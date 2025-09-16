'use server'

import { createClient } from "@/utils/supabase/server"
import Dashboard from "./Dashboard"

export default async function Page() {
  const supabase = await createClient()
  const { data: { user }, error: usererror } = await supabase.auth.getUser()
  if(usererror) { 
    console.log(usererror)
    throw usererror
  }
  let userprofile;
  if(user?.id){
    const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    if(Array.isArray(profile)){
      userprofile = profile[0];
    }
  }
  const { data, error } = await supabase.functions.invoke('restful-api/cv', {method: 'GET'})
  if(error) { 
    console.log(error)
    throw error
  }
  return (
    <>
      <Dashboard cvs={data.data} user={userprofile!}/>
    </>
  )
}
