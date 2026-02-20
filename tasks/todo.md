# Plano - Melhorias de UI (Preview e Confetes)

## Itens
- [x] Adicionar botao de voltar ao menu inicial na parte de criar um presente (`/criar`).
- [x] Carregar preview em tempo real dos textos (grande e pequeno) com o componente `TextOverlay` durante a criacao.
- [x] Ajustar a visualizacao da imagem (`app/criar/page.tsx`) para manter o formato original (aspect ratio real sem cortes bruscos).
- [x] Criar componente `HomePreview` no menu inicial (`/`), e adicionar interatividade para mostrar a caixa fechada e clicar para abrir.
- [x] Corrigir o alinhamento da explosao principal de confetes usando coordenadas de tela (`lib/confetti.ts`).
- [x] Adicionar novo efeito de "chuva de confetes" prolongada (caindo do topo por alguns segundos) na tela inicial e ao abrir o presente (`fireFallingConfetti`).
- [x] Garantir que `npm run build` passe sem problemas (tipagens OK e variaveis limpas).
- [x] Registrar todo o novo conhecimento no `tasks/lessons.md` e criar `tasks/context.md`.

## Review
### Alteracoes Realizadas
- `app/criar/page.tsx`: Modificado o template de preview. Utilizei `<img>` com `object-contain` e `max-h-[60vh]` no lugar do `<Image>` para previnir distorcoes e garantir comportamento real das imagens sem usar CDN otimizado no input bruto. Botao de `Link` adicionado ao topo apontando para `/`.
- `app/page.tsx` e `components/HomePreview.tsx`: Modifiquei a landing page e introduzi um componente com states para ilustrar o processo em looping (clicou -> explode -> reseta em 5s).
- `app/p/[slug]/page.tsx`: Embutido ambos metodos de disparo, com calculo da dimensao x/y vindo da DOM na hora do clique.
- `lib/confetti.ts`: Refaturado para expor as origens e suportar chamadas multiplas baseadas em um `setInterval` atrelado ao ciclo de `Date.now()`.

### Resultado da Verificacao
- O App esta rodando lisamente e renderizando corretamente na porta 3000. Linter e compilador do Typescript indicam seguranca na entrega. Sem warnings impactantes.
