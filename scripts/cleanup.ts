import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME || "gifts";
const DRY_RUN = process.env.DRY_RUN === "1" || process.env.DRY_RUN === "true";
const BATCH_SIZE = 500;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("ERRO: Variaveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY sao obrigatorias.");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log(`[CLEANUP] Iniciando limpeza de presentes expirados...`);
  console.log(`[CLEANUP] BUCKET_NAME: ${BUCKET_NAME}`);
  if (DRY_RUN) console.log(`[CLEANUP] MODO DRY RUN ATIVADO. Nenhum dado real sera deletado.`);

  let totalRemoved = 0;
  let hasMore = true;

  while (hasMore) {
    const nowISO = new Date().toISOString();

    const { data: expiredGifts, error: fetchError } = await supabase
      .from("gifts")
      .select("id, image_path")
      .lt("expires_at", nowISO)
      .order("expires_at", { ascending: true })
      .limit(BATCH_SIZE);

    if (fetchError) {
      console.error("[ERRO] Falha ao buscar presentes expirados:", fetchError.message);
      process.exit(1);
    }

    if (!expiredGifts || expiredGifts.length === 0) {
      console.log(`[CLEANUP] Nenhum presente expirado encontrado neste lote.`);
      hasMore = false;
      break;
    }

    console.log(`[CLEANUP] Processando lote de ${expiredGifts.length} presentes...`);

    const pathsToRemove = expiredGifts.map((gift) => gift.image_path).filter(Boolean);
    const idsToRemove = expiredGifts.map((gift) => gift.id);

    if (DRY_RUN) {
      console.log(`[DRY RUN] Simulando exclusao de ${pathsToRemove.length} imagens no storage.`);
      console.log(`[DRY RUN] Simulando exclusao de ${idsToRemove.length} registros no banco de dados.`);
      totalRemoved += expiredGifts.length;
      hasMore = false; // Em dry run, simular apenas o primeiro lote
      continue;
    }

    // 1. Remover imagens do Storage
    if (pathsToRemove.length > 0) {
      const { error: storageError } = await supabase.storage.from(BUCKET_NAME).remove(pathsToRemove);
      if (storageError) {
        console.error(`[ERRO] Falha ao deletar imagens do bucket ${BUCKET_NAME}:`, storageError.message);
        // Continuamos com os demais porque a imagem pode ja nao existir.
      }
    }

    // 2. Remover registros do banco de dados
    const { error: dbError } = await supabase.from("gifts").delete().in("id", idsToRemove);
    if (dbError) {
      console.error(`[ERRO] Falha ao deletar registros do banco de dados:`, dbError.message);
      // Se falhar o banco, abortamos pra nao criar loop infinito lendo os mesmos dados repetidas vezes.
      process.exit(1);
    }

    totalRemoved += expiredGifts.length;
    console.log(`[CLEANUP] Lote finalizado com sucesso.`);

    if (expiredGifts.length < BATCH_SIZE) {
      hasMore = false;
    }
  }

  console.log(`[CLEANUP] Operacao concluida. Total de presentes expirados removidos: ${totalRemoved}.`);
}

main().catch((err) => {
  console.error("[ERRO FATAL] Ocorreu uma excecao nao tratada:", err);
  process.exit(1);
});
