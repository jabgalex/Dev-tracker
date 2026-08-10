import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        logs: { orderBy: { createdAt: "desc" } },
      },
    });

    if (!project) {
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

    const existingProject = await prisma.project.findUnique({ where: { id } });
    if (!existingProject) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // If whereILeftOff changed, automatically record a SessionLog
    if (whereILeftOff && whereILeftOff !== existingProject.whereILeftOff) {
      await prisma.sessionLog.create({
        data: {
          projectId: id,
          summary: whereILeftOff,
          aiAgentUsed: Array.isArray(aiAgents) && aiAgents.length > 0 ? aiAgents[0] : "Desarrollo",
        },
      });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        ...(name && { name }),
        description: description !== undefined ? description : existingProject.description,
        status: status || existingProject.status,
        whereILeftOff: whereILeftOff !== undefined ? whereILeftOff : existingProject.whereILeftOff,
        lastSessionDate: new Date(),
        localPath: localPath !== undefined ? localPath : existingProject.localPath,
        localPort: localPort ? parseInt(localPort) : existingProject.localPort,
        githubUrl: githubUrl !== undefined ? githubUrl : existingProject.githubUrl,
        vercelUrl: vercelUrl !== undefined ? vercelUrl : existingProject.vercelUrl,
        supabaseUrl: supabaseUrl !== undefined ? supabaseUrl : existingProject.supabaseUrl,
        vpsIpOrHost: vpsIpOrHost !== undefined ? vpsIpOrHost : existingProject.vpsIpOrHost,
        prodUrl: prodUrl !== undefined ? prodUrl : existingProject.prodUrl,
        aiAgents: Array.isArray(aiAgents) ? aiAgents : existingProject.aiAgents,
        techStack: Array.isArray(techStack) ? techStack : existingProject.techStack,
      },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        logs: { orderBy: { createdAt: "desc" } },
      },
    });

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
    await prisma.project.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
