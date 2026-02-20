# Contexto do Projeto: Web Meme (Presente Meme Instantâneo)

## O que é este projeto?
É uma aplicação construída em **Next.js (App Router)** para enviar "presentes digitais" interativos, no formato de uma "caixa misteriosa" que, ao ser clicada, explode confetes e exibe uma imagem customizada com estética de meme (texto grande em cima, pequeno embaixo).

### Fluxo do Usuário
1. O usuário entra na página inicial (`/`), entende o app e clica na caixa de exemplo (um componente interativo real de preview).
2. Na página de criação (`/criar`), seleciona uma imagem (`.jpg, .png, .webp, .gif`).
3. Digita um texto grande (topo) e pequeno (rodapé) que aparece instantaneamente em formato de meme (letra branca com sombra preta contornando).
4. O sistema gera um Link encurtado e salva a imagem e os metadados no **Supabase**.
5. Na página de recepção (`/p/[slug]`), o ganhador abre o link, vê uma caixa fechada e clica nela. Ocorre a animação de abertura, disparo de confete do centro e "chuva de confetes", exibindo finalmente a imagem e os textos.

## Stack Tecnológica
- **Framework:** Next.js 16.1.6 (App Router) + React 18.
- **Estilização:** Tailwind CSS + UI Customizada (ex: `app-shell`, `card-soft`, botões com classes utilitárias baseadas em variáveis CSS).
- **Animações:** Framer Motion (para a caixa balançando e abrindo) e `canvas-confetti` (para os confetes e efeito da chuva).
- **Backend/DB/Storage:** API Routes no próprio Next.js (`/api/gifts` e `/api/gifts/[slug]`), integradas com `@supabase/supabase-js`.
- **Hospedagem ideal:** Vercel (projetado para Node.js Runtime server-side e não edge).

## Arquitetura Importante (API)
- O Supabase é acessado via `Service Role` exclusivo em rotas `server-side` (`app/api/...` e `lib/supabaseAdmin.ts`).
- Para criar: o cliente faz um `POST /api/gifts` -> a API salva no DB, gera um `signedUploadUrl` do Storage (validando extensão/tamanho) -> O cliente faz upload direto via `PUT`.
- Para visualizar: cliente bate no front que requisita de forma síncrona `GET /api/gifts/[slug]`. Se não estiver expirado, a API pega um `signedUrl` de leitura e devolve. A resposta também diz se ativou o "aviso de conteúdo".

## Lições de UX Recentes
1. **Preview Autêntico:** Imagens de upload brutas muitas vezes distorcem em `<Image fill>` do Next. Utilizamos a tag natural `<img>` com proporções `max-h-[60vh] w-full object-contain` para garantir que um meme na horizontal ou vertical caiba integralmente no preview da criação sem cortar cabeças, acompanhado do overlay `TextOverlay` para "ver o que vai sair".
2. **Sistema de Confetes Inteligente:** `fireConfetti` na `lib/confetti.ts` aceita as coordenadas calculadas (`getBoundingClientRect`) do botão de abrir a caixa, para evitar que estoure no local incorreto. `fireFallingConfetti` simula confetes caindo das extremidades.

## Estado Atual do Desenvolvimento (20-Fev-2026)
A aplicação está totalmente funcional: 
- O fluxo de criação local/api está 100% estabelecido com proteção JWT/ServiceKey server-only.
- A UI de preview tanto na `Home` quanto na aba de `Criar` estão finalizadas e polidas.
- Todos os repositórios sensíveis ou inúteis (ex: `/bruno` workspace, dump local, ambiente de teste solto) foram isolados do repositório no Github via `.gitignore`.
