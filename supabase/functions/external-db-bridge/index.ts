import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SLOW_QUERY_THRESHOLD_MS = 3000;
const VERY_SLOW_QUERY_THRESHOLD_MS = 8000;

interface TelemetryMeta {
  operation: string;
  table?: string;
  rpcName?: string;
  limit?: number;
  offset?: number;
  countMode?: string;
  durationMs: number;
  recordCount?: number;
  status: "ok" | "error" | "slow" | "very_slow";
  error?: string;
  userId?: string | null;
}

function classifySeverity(durationMs: number, hasError: boolean): "ok" | "error" | "slow" | "very_slow" {
  if (hasError) return "error";
  if (durationMs >= VERY_SLOW_QUERY_THRESHOLD_MS) return "very_slow";
  if (durationMs >= SLOW_QUERY_THRESHOLD_MS) return "slow";
  return "ok";
}

function emitTelemetry(meta: TelemetryMeta) {
  const icon =
    meta.status === "very_slow" ? "🔴" : meta.status === "slow" ? "🟡" : meta.status === "error" ? "❌" : "✅";

  const target = meta.rpcName || meta.table || "unknown";
  const line =
    `${icon} [telemetry] ${meta.operation}:${target} ${meta.durationMs}ms` +
    ` | records=${meta.recordCount ?? "-"}` +
    ` limit=${meta.limit ?? "-"}` +
    ` offset=${meta.offset ?? "-"}` +
    ` count=${meta.countMode ?? "-"}`;

  if (meta.status === "very_slow") {
    console.warn(`⚠️ VERY SLOW QUERY: ${line}`);
  } else if (meta.status === "slow") {
    console.warn(`⚠️ SLOW QUERY: ${line}`);
  } else if (meta.status === "error") {
    console.error(line + ` error=${meta.error}`);
  } else {
    console.info(line);
  }

  // Persist to local DB (fire-and-forget) only if status != ok
  if (meta.status !== "ok") {
    try {
      const localUrl = Deno.env.get("SUPABASE_URL");
      const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
      if (localUrl && serviceKey) {
        const localClient = createClient(localUrl, serviceKey);
        localClient
          .from("query_telemetry")
          .insert({
            operation: meta.operation,
            table_name: meta.table || null,
            rpc_name: meta.rpcName || null,
            duration_ms: meta.durationMs,
            record_count: meta.recordCount ?? null,
            query_limit: meta.limit ?? null,
            query_offset: meta.offset ?? null,
            count_mode: meta.countMode || null,
            severity: meta.status,
            error_message: meta.error || null,
            user_id: meta.userId || null,
          })
          .then(({ error: insertErr }) => {
            if (insertErr) console.warn("[telemetry-persist] Insert failed:", insertErr.message);
          });
      }
    } catch (_e) {
      // Fire-and-forget: NEVER block the main response
    }
  }
}

function sanitizeData(val: any): any {
  if (val === "undefined" || val === "null" || val === undefined) return null;
  if (Array.isArray(val)) return val.map(sanitizeData);
  if (val !== null && typeof val === "object") {
    const obj: any = {};
    for (const key in val) {
      obj[key] = sanitizeData(val[key]);
    }
    return obj;
  }
  return val;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "No authorization header" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Security Check: Verify JWT
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
  const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: authHeader } },
  });

  const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    console.log("[external-db-bridge] Request body:", JSON.stringify(body));
    const { action, table, columns, filters: rawFilters, limit, offset, countMode, data: rawData, userId } = body;
    // Aliases: client may send `fn` for rpc and `params` for rpc args.
    const rpcName = body.rpcName || body.fn;
    const rpcArgs = sanitizeData(body.params ?? rawData);
    const data = sanitizeData(rawData);
    const filters = rawFilters
      ?.map((f: any) => ({
        ...f,
        value: sanitizeData(f.value),
      }))
      .filter(
        (f: any) =>
          f.value !== null && f.value !== undefined && f.value !== "" && f.value !== "null" && f.value !== "undefined" && f.value !== "all",
      );

    // Removed tolerant mode: errors will now be returned as 400 to the client
    // for immediate visibility of schema issues.

    const externalUrl = Deno.env.get("EXTERNAL_DB_URL");
    const externalKey = Deno.env.get("EXTERNAL_DB_KEY");

    if (!externalUrl || !externalKey) {
      return new Response(JSON.stringify({ error: "External database not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const externalClient = createClient(externalUrl, externalKey);
    const selectColumns = columns || "*";
    const queryLimit = limit || 100;
    const queryOffset = offset || 0;
    const queryCountMode = countMode || "none";

    // SELECT
    if (action === "select") {
      const startTime = performance.now();
      
      // Multi-tenant enforcement (basic)
      // If the table has an empresa_id column, we should ideally filter by it.
      // For now, we trust the client but log the user_id.
      
      let query = externalClient
        .from(table)
        .select(selectColumns, {
          count: queryCountMode === "none" ? undefined : queryCountMode,
        });
      
      if (queryLimit !== -1) {
        query = query.range(queryOffset, queryOffset + queryLimit - 1);
      }

      // Apply filters
      if (filters) {
        for (const f of filters) {
          if (f.op === "eq") query = query.eq(f.column, f.value);
          else if (f.op === "neq") query = query.neq(f.column, f.value);
          else if (f.op === "gt") query = query.gt(f.column, f.value);
          else if (f.op === "gte") query = query.gte(f.column, f.value);
          else if (f.op === "lt") query = query.lt(f.column, f.value);
          else if (f.op === "lte") query = query.lte(f.column, f.value);
          else if (f.op === "like") query = query.like(f.column, f.value);
          else if (f.op === "ilike") query = query.ilike(f.column, f.value);
          else if (f.op === "in") query = query.in(f.column, f.value);
          else if (f.op === "is") query = query.is(f.column, f.value);
          else if (f.op === "or") query = query.or(f.value);
          else if (f.op === "not") query = query.not(f.column, f.extraOp || 'eq', f.value);
        }
      }

      const { data: selectData, error: selectError, count } = await query;
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!selectError);
      emitTelemetry({
        operation: "select",
        table,
        limit: queryLimit,
        offset: queryOffset,
        countMode: queryCountMode,
        durationMs,
        status,
        recordCount: selectData?.length ?? 0,
        error: selectError?.message,
        userId,
      });

      if (selectError) {
        return new Response(JSON.stringify({ error: selectError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: selectData, count, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // INSERT
    if (action === "insert") {
      const startTime = performance.now();
      const { data: insertData, error: insertError } = await externalClient.from(table).insert(data).select();
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!insertError);
      emitTelemetry({
        operation: "insert",
        table,
        durationMs,
        status,
        recordCount: insertData?.length ?? 0,
        error: insertError?.message,
        userId,
      });

      if (insertError) {
        return new Response(JSON.stringify({ error: insertError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: insertData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPSERT
    if (action === "upsert") {
      const startTime = performance.now();
      const { data: upsertData, error: upsertError } = await externalClient.from(table).upsert(data).select();
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!upsertError);
      emitTelemetry({
        operation: "upsert",
        table,
        durationMs,
        status,
        recordCount: upsertData?.length ?? 0,
        error: upsertError?.message,
        userId,
      });

      if (upsertError) {
        return new Response(JSON.stringify({ error: upsertError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: upsertData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

      return new Response(JSON.stringify({ data: insertData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // UPDATE
    if (action === "update") {
      const startTime = performance.now();
      let query = externalClient.from(table).update(data);
      if (filters) {
        for (const f of filters) {
          if (f.op === "eq") query = query.eq(f.column, f.value);
        }
      }
      const { data: updateData, error: updateError } = await query.select();
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!updateError);
      emitTelemetry({
        operation: "update",
        table,
        durationMs,
        status,
        recordCount: updateData?.length ?? 0,
        error: updateError?.message,
        userId,
      });

      if (updateError) {
        return new Response(JSON.stringify({ error: updateError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: updateData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE
    if (action === "delete") {
      const startTime = performance.now();
      let query = externalClient.from(table).delete();
      if (filters) {
        for (const f of filters) {
          if (f.op === "eq") query = query.eq(f.column, f.value);
        }
      }
      const { data: deleteData, error: deleteError } = await query.select();
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!deleteError);
      emitTelemetry({
        operation: "delete",
        table,
        durationMs,
        status,
        recordCount: deleteData?.length ?? 0,
        error: deleteError?.message,
        userId,
      });

      if (deleteError) {
        return new Response(JSON.stringify({ error: deleteError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: deleteData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // RPC
    if (action === "rpc") {
      const startTime = performance.now();
      if (!rpcName) {
        return new Response(JSON.stringify({ error: "rpc action requires 'rpcName' or 'fn'" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const { data: rpcData, error: rpcError } = await externalClient.rpc(rpcName, rpcArgs || {});
      const durationMs = Math.round(performance.now() - startTime);

      const status = classifySeverity(durationMs, !!rpcError);
      emitTelemetry({
        operation: "rpc",
        rpcName,
        durationMs,
        status,
        recordCount: Array.isArray(rpcData) ? rpcData.length : rpcData ? 1 : 0,
        error: rpcError?.message,
        userId,
      });

      if (rpcError) {
        return new Response(JSON.stringify({ error: rpcError.message }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ data: rpcData, duration_ms: durationMs }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("[external-db-bridge] Error:", err);
    return new Response(JSON.stringify({ error: err.message || "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
