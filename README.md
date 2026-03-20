# Admin Dashboard — Gestão Interna

Painel administrativo unificado para controlar usuários, assinaturas e métricas dos produtos:

- **Open-Trafego** (SaaS tráfego pago)
- **AntiGravity Kit** (produto low-ticket)

---

## 🚀 Quick Start

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edite .env com DATABASE_URL (NeonDB) e outras chaves
npx prisma generate
npm run db:push
npm run seed   # cria admin inicial
npm run dev     # roda em http://localhost:3001

# Frontend
cd ../frontend
npm install
npm run dev     # roda em http://localhost:5173
```

**Admin login:**
- Email: `admin@clawdiao.com`
- Senha: `admin123`

---

## 📦 Stack

- Backend: Node.js + Express + TypeScript + Prisma
- Frontend: React + Vite + Tailwind + Recharts
- DB: NeonDB (PostgreSQL)
- Auth: JWT (admin sessions)
- Pagamentos: Stripe (sync de assinaturas)
- Deploy: Railway (backend) + Vercel (frontend)

---

## 🔐 Variáveis de Ambiente

### Backend (.env)

```env
DATABASE_URL="postgresql://user:pass@host/db?sslmode=require"
ADMIN_JWT_SECRET="super-secret-jwt-key"
ADMIN_JWT_EXPIRES_IN="1h"
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
CORS_ORIGIN="http://localhost:5173"
RESEND_API_KEY="re_..."
FROM_EMAIL="admin@yourdomain.com"
LOG_LEVEL="info"
```

### Frontend (.env.production — Vercel)

```env
VITE_API_URL=https://seu-backend.railway.app
```

---

## 🗃️ Database Schema

Tabelas admin (criadas via Prisma):

- `admin_users` — administradores
- `admin_logs` — auditoria de ações
- `system_metrics` — métricas agregadas diariamente
- `notification_queue` — emails em fila

Reutiliza tabelas do Open-Trafego:

- `users`
- `tenants`
- `subscriptions`

---

## 🔗 Integrações

### Stripe
O admin pode gerenciar assinaturas (cancelar, reativar, mudar plano) usando a API do Stripe.

- `STRIPE_SECRET_KEY` necessária
- `STRIPE_WEBHOOK_SECRET` para receber updates (configurar webhook)

### Resend (opcional)
Para enviar emails de notificação (ex: falha pagamento, trial expirando).

---

## 📊 Features MVP

- Login admin (email/senha)
- Dashboard overview (usuários, assinaturas ativas, novos trials expirando)
- Listagem de usuários (com busca)
- Listagem de assinaturas (com ações cancel/reenable)
- Métricas básicas ( gráficos dummy para estrutura )
- Logs de admin actions (audit trail)
- Health check do sistema

---

## 🏗️ Extensões Futuras

- Sincronização automática de dados Stripe → tabela `subscriptions`
- Cálculo de MRR/ARR real
- Funil de conversão (event tracking)
- Exportação CSV/PDF de relatórios
- Notificações internas (email admin quando pagamento falha, etc)
- 2FA para admins
- Multi-role (finance, support, super_admin)
- KPI cards personalizáveis
- Dark/Light theme toggle

---

## 🧪 Testes

```bash
# Backend unit (futuro)
npm test

# Frontend (futuro)
npm run test
```

---

## 🚀 Deploy Produção

### Backend → Railway
1. Conecte repo no Railway (GitHub → admin-dashboard/backend)
2. Configure variables (DATABASE_URL, ADMIN_JWT_SECRET, STRIPE_SECRET_KEY, etc.)
3. Deploy automático

### Frontend → Vercel
1. New Project → Import → `admin-dashboard/frontend`
2. Set `VITE_API_URL` para URL do backend Railway
3. Deploy

---

## ⚠️ Segurança

- Use HTTPS
-strengthen ADMIN_JWT_SECRET (256-bit random)
- IP allowlist (opcional)
- Rate limiting já habilitado
- Logs de auditoria completos
- Senhas com bcrypt (10 rounds)

---

**Feito com 🦁 por Clawdiao**
