import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    const { data: projects, error } = await supabase
      .from("Project")
      .select("*, tasks:Task(*), logs:SessionLog(*)")
      .order("updatedAt", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ projects });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
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

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const { data: project, error } = await supabase
      .from("Project")
      .insert({
        name,
        description: description || null,
        status: status || "ACTIVE",
        whereILeftOff: whereILeftOff || null,
        localPath: localPath || null,
        localPort: localPort ? parseInt(localPort) : null,
        githubUrl: githubUrl || null,
        vercelUrl: vercelUrl || null,
        supabaseUrl: supabaseUrl || null,
        vpsIpOrHost: vpsIpOrHost || null,
        prodUrl: prodUrl || null,
        aiAgents: aiAgents || [],
        techStack: techStack || [],
      })
      .select("*, tasks:Task(*), logs:SessionLog(*)")
      .single();

    if (error) throw error;

    return NextResponse.json({ project });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 }
    );
  }
}
