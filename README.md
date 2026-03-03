```
██████╗ ██████╗ ███████╗███████╗███████╗███╗   ██╗████████╗███████╗
██╔══██╗██╔══██╗██╔════╝██╔════╝██╔════╝████╗  ██║╚══██╔══╝██╔════╝
██████╔╝██████╔╝█████╗  ███████╗█████╗  ██╔██╗ ██║   ██║   █████╗
██╔═══╝ ██╔══██╗██╔══╝  ╚════██║██╔══╝  ██║╚██╗██║   ██║   ██╔══╝
██║     ██║  ██║███████╗███████║███████╗██║ ╚████║   ██║   ███████╗
╚═╝     ╚═╝  ╚═╝╚══════╝╚══════╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝
                                                    M E M E  🎁
```

> Monte um presente com foto e frases estilo meme, gere um link e entregue com animação de caixa e confete.

---

## ✨ Como funciona

```
  CRIADOR                              DESTINATÁRIO
  ───────                              ────────────

  1. Arrasta uma imagem          →     Recebe o link
  2. Digita os textos meme       →     Clica na caixa 🎁
  3. Clica em "Gerar link"       →     🎊 Confete + revelação
  4. Compartilha via WhatsApp    →     Vê a imagem com os textos
```

---

## 🖼️ Layout

```
Desktop (≥ 1024px)
┌─────────────────────────┬──────────────────────────────────────┐
│      EditorPanel        │           PreviewPanel               │
│                         │                                      │
│  🎁 Presente Meme       │   ┌──────────────────────────────┐   │
│                         │   │                              │   │
│  [ Arraste uma imagem ] │   │    Preview ao vivo /         │   │
│                         │   │    Spinner / GiftBox /       │   │
│  Texto grande ________  │   │    Imagem revelada           │   │
│  Texto pequeno _______  │   │                              │   │
│                         │   └──────────────────────────────┘   │
│  ☑ Aviso de conteúdo   │                                      │
│                         │   [ WhatsApp ]  [ Copiar link ]      │
│  [ Gerar link ]         │                                      │
└─────────────────────────┴──────────────────────────────────────┘

Mobile: blocos empilhados verticalmente
```

---

## 🔄 Máquina de estados

```
                   upload ok
  editing  ──────────────────►  gift_ready
     ▲      generating (spinner)      │
     │                                │ clique na caixa
     │                                ▼
  [ Criar outro ]              opening (420ms)
     │                                │
     └──────────  gift_open  ◄────────┘
                  (imagem + compartilhar)
```

---

## 🛠️ Stack

| Camada        | Tecnologia                        |
|---------------|-----------------------------------|
| Framework     | Next.js 16 (App Router)           |
| UI            | React 19 + Tailwind CSS v4        |
| Animações     | Framer Motion 12                  |
| Estado        | Zustand 5                         |
| Confete       | canvas-confetti                   |
| Backend       | Supabase (Postgres + Storage)     |
| Linguagem     | TypeScript 5 (strict)             |
| CI / Limpeza  | GitHub Actions (cron diário)      |

---

## 📁 Estrutura

```
web-meme/
├── app/
│   ├── page.tsx                  # Dashboard (tela única)
│   ├── criar/page.tsx            # Redirect → /
│   ├── p/[slug]/page.tsx         # Revelação para o destinatário
│   ├── api/gifts/
│   │   ├── route.ts              # POST – cria presente
│   │   └── [slug]/route.ts      # GET  – busca presente
│   └── globals.css
│
├── components/
│   ├── Dashboard.tsx             # Orquestrador + estado global
│   ├── EditorPanel.tsx           # Painel de edição (esquerda)
│   ├── PreviewPanel.tsx          # Preview / revelação (direita)
│   ├── ImageDropZone.tsx         # Drag-and-drop de imagem
│   ├── ShareActions.tsx          # WhatsApp + copiar link
│   ├── GiftBox.tsx               # Caixa animada (Framer Motion)
│   └── TextOverlay.tsx           # Textos meme sobre a imagem
│
├── lib/
│   ├── store.ts                  # Zustand – cache local do presente
│   ├── gift-api.ts               # Chamadas à API REST
│   ├── confetti.ts               # Helpers de confete
│   ├── validators.ts             # Sanitização e validação
│   ├── config.ts                 # Constantes (TTL, bucket…)
│   ├── ids.ts                    # Gerador de slugs únicos
│   └── supabaseAdmin.ts          # Cliente Supabase (server-only)
│
├── scripts/
│   └── cleanup.ts                # Remove presentes expirados
│
└── .github/workflows/
    └── cleanup.yml               # Cron diário às 06h UTC
```

---

## 🚀 Rodando localmente

### 1. Clone e instale as dependências

```bash
git clone https://github.com/Je-Carlos/web-meme.git
cd web-meme
npm install
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
SUPABASE_URL=https://<seu-projeto>.supabase.co
SUPABASE_ANON_KEY=<sua-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<sua-service-role-key>
```

> As chaves estão disponíveis em **Supabase → Project Settings → API**.

### 3. Inicie o servidor de desenvolvimento

```bash
npm run dev
```

Acesse **[http://localhost:3000](http://localhost:3000)**.

---

## 📦 Scripts disponíveis

| Comando              | Descrição                                  |
|----------------------|--------------------------------------------|
| `npm run dev`        | Servidor de desenvolvimento (Turbopack)    |
| `npm run build`      | Build de produção                          |
| `npm run start`      | Serve o build de produção                  |
| `npm run lint`       | Verifica o código com ESLint               |

### Limpeza manual de presentes expirados

```bash
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/cleanup.ts
```

Para simular sem deletar nada:

```bash
DRY_RUN=1 SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx tsx scripts/cleanup.ts
```

---

## 🗄️ Banco de dados (Supabase)

### Tabela `gifts`

| Coluna          | Tipo          | Descrição                        |
|-----------------|---------------|----------------------------------|
| `id`            | `uuid`        | Chave primária                   |
| `slug`          | `text`        | Identificador único da URL       |
| `image_path`    | `text`        | Caminho no Storage bucket        |
| `top_text`      | `text / null` | Texto grande (meme)              |
| `bottom_text`   | `text / null` | Texto pequeno (meme)             |
| `expires_at`    | `timestamptz` | Expiração (24h após criação)     |
| `views`         | `int`         | Contador de visualizações        |

### Storage

Bucket: **`gifts`** — imagens ficam em `<slug>/<hash>.<ext>`.

---

## ⚙️ GitHub Actions

O workflow `cleanup.yml` roda **diariamente às 06h00 UTC** e remove do banco e do storage todos os presentes com `expires_at` no passado.

```
Secrets necessários:
  SUPABASE_URL
  SUPABASE_SERVICE_ROLE_KEY

Variável opcional (padrão: "gifts"):
  BUCKET_NAME
```

---

## 🌐 Rotas

| Rota               | Tipo      | Descrição                              |
|--------------------|-----------|----------------------------------------|
| `/`                | Estática  | Dashboard de criação                   |
| `/criar`           | Estática  | Redireciona para `/`                   |
| `/p/[slug]`        | Dinâmica  | Revelação do presente para o destinatário |
| `POST /api/gifts`  | API       | Cria um novo presente                  |
| `GET /api/gifts/[slug]` | API  | Busca dados de um presente             |
