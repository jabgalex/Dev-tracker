import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Seeding database with sample projects...");

  // Delete existing data
  await prisma.sessionLog.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.create({
    data: {
      name: "Project Dev Tracker",
      description: "Tracker local para controlar el progreso, infraestructura y agentes de IA en proyectos de software personal.",
      status: "ACTIVE",
      whereILeftOff: "Configurando esquema SQLite con Prisma 7 y construyendo el Command Center UI con filtros interactivos.",
      lastSessionDate: new Date(),
      localPath: "/Users/pc/Documents/Anty gravity/Project-dev-tracker",
      localPort: 3000,
      githubUrl: "https://github.com/user/project-dev-tracker",
      vercelUrl: "https://vercel.com/user/project-dev-tracker",
      supabaseUrl: null,
      vpsIpOrHost: null,
      prodUrl: "http://localhost:3000",
      aiAgents: JSON.stringify(["Antigravity", "Hermes"]),
      techStack: JSON.stringify(["Next.js", "React", "TailwindCSS", "SQLite", "Prisma"]),
      tasks: {
        create: [
          { title: "Implementar API de acciones de Mac (VSCode, Finder, Localhost)", completed: true, priority: "HIGH" },
          { title: "Diseñar Command Center con vista Grid y Filtros por Agente/Stack", completed: true, priority: "HIGH" },
          { title: "Añadir modal para crear y editar resúmenes 'Dónde me quedé'", completed: false, priority: "MEDIUM" },
          { title: "Probar ejecutor automático de terminal", completed: false, priority: "LOW" },
        ],
      },
      logs: {
        create: [
          { summary: "Inicializado proyecto Next.js 14 App Router y configurada la base de datos SQLite.", aiAgentUsed: "Antigravity" },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      name: "E-Commerce Supabase Microservice",
      description: "API de pagos y catálogo con base de datos en Supabase Cloud y hosting serverless en Vercel.",
      status: "PAUSED",
      whereILeftOff: "Se implementó el webhook de Stripe para procesar pagos. Pendiente arreglar RLS en tabla de órdenes en Supabase.",
      lastSessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      localPath: "/Users/pc/Projects/ecommerce-supabase-api",
      localPort: 4000,
      githubUrl: "https://github.com/user/ecommerce-supabase-api",
      vercelUrl: "https://vercel.com/user/ecommerce-api",
      supabaseUrl: "https://supabase.com/dashboard/project/abc123xyz",
      vpsIpOrHost: null,
      prodUrl: "https://api-ecommerce.vercel.app",
      aiAgents: JSON.stringify(["Hermes", "Codex"]),
      techStack: JSON.stringify(["Node.js", "Express", "Supabase", "Vercel", "TypeScript"]),
      tasks: {
        create: [
          { title: "Corregir Row Level Security (RLS) en órdenes", completed: false, priority: "HIGH" },
          { title: "Refactorizar controlador de webhook Stripe", completed: true, priority: "MEDIUM" },
        ],
      },
      logs: {
        create: [
          { summary: "Integrado SDK de Stripe y creados endpoints de Checkout Session.", aiAgentUsed: "Hermes" },
        ],
      },
    },
  });

  await prisma.project.create({
    data: {
      name: "Autonomous AI Workflow System",
      description: "Sistema distribuido desplegado en VPS Ubuntu con Docker containers para procesamiento de datos con Open Code.",
      status: "IN_PRODUCTION",
      whereILeftOff: "Desplegado container Docker v1.4 en VPS. Logs estables sin fugas de memoria. Monitoreo configurado.",
      lastSessionDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
      localPath: "/Users/pc/Projects/ai-workflow-daemon",
      localPort: 8080,
      githubUrl: "https://github.com/user/ai-workflow-daemon",
      vercelUrl: null,
      supabaseUrl: null,
      vpsIpOrHost: "vps-hetzner-ubuntu-01 (195.201.12.34)",
      prodUrl: "https://workflow.midominio.com",
      aiAgents: JSON.stringify(["Open Code", "Codex"]),
      techStack: JSON.stringify(["Python", "Docker", "VPS", "FastAPI", "Redis", "PostgreSQL"]),
      tasks: {
        create: [
          { title: "Configurar ssl certbot en VPS nginx proxy", completed: true, priority: "HIGH" },
          { title: "Optimizar pool de conexiones Redis", completed: true, priority: "MEDIUM" },
        ],
      },
      logs: {
        create: [
          { summary: "Publicada versión v1.4 con contenedor Docker optimizado.", aiAgentUsed: "Open Code" },
        ],
      },
    },
  });

  console.log("Seeding finished successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
