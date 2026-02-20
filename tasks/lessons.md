# Lessons

## 2026-02-19
- Quando houver arquivo de instrucoes local (ex: `.codex/INSTRUCTIONS.md`), ler e executar antes de encerrar uma analise.
- Em pedidos de "execute as instrucoes", assumir implementacao completa e verificacao, nao apenas auditoria.
- Em tarefas de API, sempre validar endpoints com requests reais (POST/GET) e capturar causa raiz antes de concluir.

## 2026-02-20
- **Seguranca/Git**: NUNCA rodar `git add .` cegamente e submeter commits sem verificar o `git status`. Sempre confirmar arquivos sensiveis/inuteis (ex: chamadas Bruno, dumps de DB, testes locais nao rastreados) estao devidamente adicionados no `.gitignore`.
- **React 18 Strict Mode**: Cuidado ao usar `URL.revokeObjectURL` dentro do block de montagem/desmontagem (`useEffect`) em ambientes Dev. O React monta e desmonta instantaneamente, invalidando o preview de imagem. Fazer o cleanup apenas quando a dependencia/URL de fato for substituida.
- **Tipagens Estritas**: Em builds do Next.js (TypeScript), sempre prever que tipos inferidos de forma automatica pelo Supabase (`void`, `any`, ou interfaces nao descritas estritamente) vao gerar falha na Vercel/Producao. Sempre tipar respostas.
- **Aspect Ratio Imagens**: Nao utilizar `object-cover` ou valores fixos na hora de visualizar _uploads_ dos usuarios no frontend. Preferir `object-contain` ou definir `h-auto w-full max-h-[...]` para preservar as dimensoes reais e evitar recortes.
- **Animacoes Dinamicas**: Evitar posicionamento estatico (hardcode `0.5`, `0.6`) para o Canvas Confetti em interfaces dinamicas. Usar sempre calculos em cima das coordenadas de evento e posicao relativa do elemento (`e.currentTarget.getBoundingClientRect()`) combinados com a janela (`window.innerWidth/innerHeight`).
