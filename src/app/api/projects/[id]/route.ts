import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { data: project, error } = await supabase
      .from("Project")
      .select("*, tasks:Task(*), logs:SessionLog(*)")
      .eq("id", id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      description,
      status,
      whereILeftOff,
      localPath,
      localPort,
      githubUrl,
      vercelUrl,
      supabaseUrl,
      vpsIpOrHost,
      prodUrl,
      aiAgents,
      techStack,
    } = body;

    // Check if project exists
    const { data: existingProject, error: fetchError } = await supabase
      .from("Project")
      .select("whereILeftOff")
      .eq("id", id)
      .single();

    if (fetchError || !existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If whereILeftOff changed, record a SessionLog
    if (whereILeftOff && whereILeftOff !== existingProject.whereILeftOff) {
      await supabase.from("SessionLog").insert({
        projectId: id,
        summary: whereILeftOff,
        aiAgentUsed: Array.isArray(aiAgents) && aiAgents.length > 0 ? aiAgents[0] : "Desarrollo",
      });
    }

    const updateData: any = { lastSessionDate: new Date().toISOString() };
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (whereILeftOff !== undefined) updateData.whereILeftOff = whereILeftOff;
    if (localPath !== undefined) updateData.localPath = localPath;
    if (localPort !== undefined) updateData.localPort = localPort ? parseInt(localPort) : null;
    if (githubUrl !== undefined) updateData.githubUrl = githubUrl;
    if (vercelUrl !== undefined) updateData.vercelUrl = vercelUrl;
    if (supabaseUrl !== undefined) updateData.supabaseUrl = supabaseUrl;
    if (vpsIpOrHost !== undefined) updateData.vpsIpOrHost = vpsIpOrHost;
    if (prodUrl !== undefined) updateData.prodUrl = prodUrl;
    if (Array.isArray(aiAgents)) updateData.aiAgents = aiAgents;
    if (Array.isArray(techStack)) updateData.techStack = techStack;

    const { data: updated, error } = await supabase
      .from("Project")
      .update(updateData)
      .eq("id", id)
      .select("*, tasks:Task(*), logs:SessionLog(*)")
      .single();

    if (error) throw error;

    return NextResponse.json({ project: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await supabase.from("Project").delete().eq("id", id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
