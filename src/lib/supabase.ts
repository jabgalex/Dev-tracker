import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types matching our database schema
export interface ProjectRow {
  id: string;
  name: string;
  description: string | null;
  status: string;
  whereILeftOff: string | null;
  lastSessionDate: string;
  localPath: string | null;
  localPort: number | null;
  githubUrl: string | null;
  vercelUrl: string | null;
  supabaseUrl: string | null;
  vpsIpOrHost: string | null;
  prodUrl: string | null;
  aiAgents: any;
  techStack: any;
  createdAt: string;
  updatedAt: string;
}

export interface TaskRow {
  id: string;
  projectId: string;
  title: string;
  completed: boolean;
  priority: string;
  createdAt: string;
}

export interface SessionLogRow {
  id: string;
  projectId: string;
  summary: string;
  aiAgentUsed: string | null;
  createdAt: string;
}
