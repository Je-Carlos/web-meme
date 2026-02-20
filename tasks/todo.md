# Plano - Melhorias de UX Finais

## Itens
- [x] Resolver erro "Ver exemplo" criando uma resposta dinamica/hardcoded fixa na API (`/api/gifts/exemplo`).
- [x] Adicionar botao "Voltar ao menu inicial" (home) no fim da revelacao de presente na pagina `/p/[slug]`.
- [x] Adicionar informacao na base de `lessons.md` e `context.md` de acordo com a ultima sessao.

## Review
### Alteracoes Realizadas
- `app/api/gifts/[slug]/route.ts`: Adicionado early-return (bypass) para o parametro "exemplo", de forma que ele retorna mock de dados com imagem via CDN, o que evita interacoes com banco e nao expira, resolvendo o erro em novas sessoes.
- `app/p/[slug]/page.tsx`: Inclusao de `Link` para `/` dentro da condicao `boxState === "open"`, permitindo recomecar o app de forma natural pela pagina inicial sem precisar recarregar.
