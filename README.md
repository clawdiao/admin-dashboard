# Admin Dashboard

Painel administrativo unificado para gestão de usuários, assinaturas e métricas dos produtos **Open-Trafego** e **AntiGravity Kit**.

---

## 🚀 Quick Start

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edite .env: DATABASE_URL, ADMIN_JWT_SECRET, Stripe keys, etc.
npm run db:push
npm run db:seed   # cria admin@clawdiao.com / admin123
npm run dev       # roda na porta 3002
```

### Frontend

```bash
cd frontend
npm install
npm run dev       # roda na porta 5173 (proxy /api -> backend:3002)
```

Acesse: http://localhost:5173

Login admin: `admin@clawdiao.com` / `admin123`

---

## 📊 Features

- Dashboard Overview (usuários, assinaturas, trials)
- Gestão de Usuários (busca, detalhes)
- Gestão de Assinaturas (list, cancel, reactivate, change plan via Stripe)
- Métricas ( gráficos, MRR placeholder — sync via Stripe webhook necessário)
- Configurações do Sistema (salvar chaves Stripe, Resend, Meta, Google no banco)
- Logs de ações administrativas (audit trail)

---

## 🔐 Segurança

- Autenticação JWT própria (admin)
- Papéis: SUPER_ADMIN, FINANCE, SUPPORT
- Rate limiting
- Audit log de todas as ações
- Senhas com bcrypt

---

## 🗃️ Banco de Dados

Usa o **NeonDB** já existente. Tabelas:

### Referências (Open-Trafego)
- Tenant, User, Subscription, Connection, Campaign, Report, Alert, Log, Webhook

### Admin (novas)
- `admin_users` — administradores
- `admin_logs` — log de ações
- `system_metrics` — métricas agregadas (preencher via job)
- `system_config` — chaves de configuração (Stripe, Resend, etc.)
- `notification_queue` — fila de emails

---

## ⚙️ Configuração pelo Admin

1. Login no Admin Dashboard
2. Vá em **Config** (painel)
3. Adicione chaves:

| Chave | Descrição |
|-------|-----------|
| `STRIPE_SECRET_KEY` | Stripe secret key (live/test) |
| `STRIPE_WEBHOOK_SECRET` | Segredo do webhook Stripe |
| `RESEND_API_KEY` | API key para emails (Resend) |
| `META_APP_ID` / `META_APP_SECRET` | Integração Meta Ads |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google Ads |
| `OPENROUTER_API_KEY` | OpenRouter (IA) |

Valores ficam salvos na tabela `system_config`.  
Backend lê dessas variáveis do banco em vez de `.env` (exceto `ADMIN_JWT_SECRET` e `DATABASE_URL`).

---

## 🔄 Webhooks

### Stripe
- Endpoint: `/api/webhooks/stripe` (backend Open-Trafego)
- Eventos: `checkout.session.completed`, `customer.subscription.updated`, `invoice.payment_failed`
- Ao receber, atualiza `subscriptions`, `tenants`, e grava métricas.

Ainda não implementado (pendente após config Stripe keys no Admin Config).

---

## 🧪 Testes

```bash
# Backend
npm test   # (precisamos adicionar testes)

# Frontend
# ainda sem testes automatizados
```

---

## 📦 Deploy

### Backend (Railway)
1. Conectar repositório
2. Variáveis de ambiente:
   - `DATABASE_URL` (NeonDB)
   - `ADMIN_JWT_SECRET` (escolha uma string forte)
   - `CORS_ORIGIN` = URL do frontend
   - `PORT` = padrão Railway ($PORT variável)
3. Build command: `npm install && npm run db:push`
4. Start command: `npm start`

### Frontend (Vercel)
1. Import project (frontend/)
2. Environment: nenhuma necessária (usa proxy para backend)
3. Build command: `npm run build` (Vite gera `dist`)

---

## 📝 Próximos Passos

- [ ] Implementar webhook Stripe completo (syncSubscription, updateMetrics)
- [ ] Calcular MRR/ARR a partir das assinaturas (caching em system_metrics)
- [ ] Exportação CSV de relatórios
- [ ] Gráficos de receita ao longo do tempo
- [ ] Página de Logs com filtros avançados
- [ ] Notificações internas (alertas de churn, falhas de pagamento)

---

**Feito com 🦁 por Clawdiao**
