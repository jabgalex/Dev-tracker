# Dev Tracker

Control central multi-proyecto para desarrollo de software con IA. Trackea el progreso, infraestructura (Supabase, Vercel, VPS) y agentes IA (Hermes, Antigravity, Codex, Open Code, Claude) de todos tus proyectos personales.

**URL producción:** https://jauner-devtracker.vercel.app

---

## Stack

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16.3 (App Router, Turbopack) |
| UI | React 19 + Tailwind CSS v4 + Lucide Icons |
| Base de datos | Supabase PostgreSQL (UN STUDIOS) |
| Data access | `@supabase/supabase-js` (REST API / PostgREST) |
| ORM (legacy) | Prisma 7 (schema de referencia, no en runtime) |
| Deploy | Vercel (un-studios) |
| Diseño | Glassmorphism oscuro `#090d16`, acentos indigo/cyan |

---

## Historia del proyecto

### v1 — SQLite local (Jul-Ago 2026)
Proyecto original creado con Antigravity. Base de datos SQLite local (`dev.db`), solo accesible desde la Mac del desarrollador. Incluía APIs de sistema macOS (abrir VS Code, Finder, escáner de carpetas).

### v2 — Supabase Cloud (10 Ago 2026)
Migración completa a arquitectura cloud multi-proyecto:

- **SQLite → Supabase PostgreSQL**: 3 tablas (`Project`, `Task`, `SessionLog`) en el proyecto UN STUDIOS (`vrtpxobqscplspbhxivh`)
- **Prisma directo → Supabase REST API**: Se descartó la conexión directa PostgreSQL por problemas de DNS/pooler en Vercel serverless. Se usa `@supabase/supabase-js` con la publishable key + RLS policies.
- **APIs macOS eliminadas**: `scan-folder`, `open-ide`, `open-finder` no funcionan en cloud. Los componentes relacionados permanecen pero fallan silenciosamente.
- **Diseño intacto**: CSS, glassmorphism, badges, colores — sin cambios.
- **Deploy Vercel**: `un-studios/dev-tracker` → `jauner-devtracker.vercel.app`

---

## Modelo de datos

```
Project {
  id: UUID (PK, gen_random_uuid)
  name: text NOT NULL
  description: text?
  status: text DEFAULT 'ACTIVE'    — ACTIVE | PAUSED | IN_PRODUCTION | IDEA | ARCHIVED
  whereILeftOff: text?             — resumen última sesión
  lastSessionDate: timestamptz
  localPath: text?                 — ruta local macOS (informativo en cloud)
  localPort: int?
  githubUrl, vercelUrl, supabaseUrl, vpsIpOrHost, prodUrl: text?
  aiAgents: jsonb DEFAULT '[]'     — ["Hermes", "Antigravity", ...]
  techStack: jsonb DEFAULT '[]'    — ["Next.js", "Supabase", ...]
  createdAt, updatedAt: timestamptz
}

Task {
  id: UUID (PK)
  projectId: UUID FK → Project (CASCADE)
  title: text NOT NULL
  completed: bool DEFAULT false
  priority: text DEFAULT 'MEDIUM'  — HIGH | MEDIUM | LOW
  createdAt: timestamptz
}

SessionLog {
  id: UUID (PK)
  projectId: UUID FK → Project (CASCADE)
  summary: text NOT NULL
  aiAgentUsed: text?
  createdAt: timestamptz
}
```

---

## Setup local

```bash
git clone https://github.com/jabgalex/Dev-tracker.git
cd Dev-tracker
npm install
```

Crear `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://vrtpxobqscplspbhxivh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_nTv96omi7d4GT1glJlYN5w_81fOQSbU
```

```bash
npm run dev
# → http://localhost:3000
```

---

## Deploy

Conectado a Vercel (un-studios). Cada push a `main` dispara deploy automático.

```bash
vercel --prod
```

### Variables de entorno en Vercel

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://vrtpxobqscplspbhxivh.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_nTv96...` |

---

## Seguridad

- Se usa **publishable key** (anon) con RLS policies `allow_all`. Los datos del tracker no son sensibles.
- Si en el futuro se requiere autenticación, migrar a **service_role key** con JWT signing.
- El JWT secret del proyecto está disponible para firmar tokens custom.

---

## Mejoras pendientes

- [ ] Autenticación de usuario (Supabase Auth)
- [ ] Service role key para operaciones admin (en vez de anon)
- [ ] Restaurar acciones macOS como opcionales (detección de plataforma)
- [ ] Filtros avanzados y búsqueda full-text
- [ ] Export/import de proyectos
- [ ] Notificaciones (Telegram, email) para recordatorios de sesión
- [ ] Vista timeline global multi-proyecto
- [ ] Dark/light mode toggle (aunque el diseño actual es solo dark)
