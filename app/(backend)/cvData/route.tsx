"use server"
import { createClient } from "@/utils/supabase/server";
import { getAll } from "./functions/getAll";
import { createCV } from "./functions/createCV";

export async function GET() {
    try {
        const supabase = await createClient();
        return getAll(supabase);
        
    } catch (error) {
        return new Response(
        JSON.stringify({
            error,
        }),
        {
            headers: {
            "Content-Type": "application/json",
            },
            status: 400,
        }
        );
    }
}

export async function POST(
) {
    try {
        const supabase = await createClient();
        const cv = createCV(supabase);
        return new Response(JSON.stringify(cv), {
            headers: {
            "Content-Type": "application/json",
            },
            status: 200,
        });
    } catch (error) {
        return new Response(
        JSON.stringify({
            error,
        }),
        {
            headers: {
            "Content-Type": "application/json",
            },
            status: 400,
        }
        );
    }
}
