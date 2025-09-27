"use server"
import { createClient } from "@/utils/supabase/server";
import { NextRequest } from "next/server";
import { getCV } from "../functions/getCV";
import { updateCV } from "../functions/updateCV";
import { patchCV } from "../functions/patchCV";
import { duplicateCV } from "../functions/duplicateCV";
import { SupabaseClient } from "@supabase/supabase-js";
import { deleteCV } from "../functions/deleteCV";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase: SupabaseClient = await createClient();
        const { id } = await params;
        const cv = await getCV(supabase, id);
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        const payload = await request.json();
        const cv = await updateCV(supabase, id, payload);
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

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        const payload = await request.json();
        const cv = await patchCV(supabase, id, payload);
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        const cv = await duplicateCV(supabase, id);
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }) {
    try {
        const supabase = await createClient();
        const { id } = await params;
        await deleteCV(supabase, id);
        return new Response(JSON.stringify({}), {
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
