import "server-only";

import { createClient } from "@supabase/supabase-js";

let client: ReturnType<typeof createClient> | null = null;

function isLikelyJwt(value: string) {
  return value.split(".").length === 3;
}

function decodeJwtPayload(jwt: string) {
  try {
    const payload = jwt.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const pad = normalized.length % 4;
    const padded = normalized + "=".repeat(pad === 0 ? 0 : 4 - pad);
    const decoded = Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(decoded) as { role?: string };
  } catch {
    return null;
  }
}

export function getSupabaseAdmin() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL nao configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY nao configurada.");
  }

  if (serviceRoleKey.startsWith("sb_publishable_")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY invalida: foi usada chave publishable/publica. Use a chave secreta (service role).",
    );
  }

  if (isLikelyJwt(serviceRoleKey)) {
    const payload = decodeJwtPayload(serviceRoleKey);
    if (payload?.role && payload.role !== "service_role") {
      throw new Error(
        "SUPABASE_SERVICE_ROLE_KEY invalida: JWT nao possui role service_role.",
      );
    }
  }

  if (!client) {
    client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return client;
}
