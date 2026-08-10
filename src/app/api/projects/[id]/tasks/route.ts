import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, priority } = body;

    if (!title) {
      return NextResponse.json({ error: "Task title is required" }, { status: 400 });
    }

    const { data: task, error } = await supabase
      .from("Task")
      .insert({
        projectId: id,
        title,
        priority: priority || "MEDIUM",
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const { taskId, completed, title } = body;

    if (!taskId) {
      return NextResponse.json({ error: "TaskId is required" }, { status: 400 });
    }

    const updateData: any = {};
    if (completed !== undefined) updateData.completed = completed;
    if (title) updateData.title = title;

    const { data: task, error } = await supabase
      .from("Task")
      .update(updateData)
      .eq("id", taskId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json({ error: "TaskId is required" }, { status: 400 });
    }

    await supabase.from("Task").delete().eq("id", taskId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
