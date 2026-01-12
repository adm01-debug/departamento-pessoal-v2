// V19-HE003: useLogs Real Expandido
import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type LogLevel = "debug" | "info" | "warn" | "error";
export interface LogEntry { id: string; level: LogLevel; message: string; data?: any; timestamp: string; userId?: string; }

export function useLogsReal(filters?: { level?: LogLevel; userId?: string; limit?: number }) {
  const qc = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: logs, isLoading } = useQuery({
    queryKey: ["logs", filters],
    queryFn: async () => {
      let query = supabase.from("logs").select("*").order("timestamp", { ascending: false }).limit(filters?.limit || 100);
      if (filters?.level) query = query.eq("level", filters.level);
      if (filters?.userId) query = query.eq("user_id", filters.userId);
      const { data } = await query;
      return data || [];
    }
  });

  const addLog = useMutation({
    mutationFn: async (entry: Omit<LogEntry, "id" | "timestamp">) => {
      const { data } = await supabase.from("logs").insert({ ...entry, timestamp: new Date().toISOString() }).select().single();
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs"] })
  });

  const clearLogs = useMutation({
    mutationFn: async () => { await supabase.from("logs").delete().neq("id", ""); },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["logs"] })
  });

  const filteredLogs = logs?.filter(l => !searchTerm || l.message.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  const log = useCallback((level: LogLevel, message: string, data?: any) => {
    addLog.mutate({ level, message, data });
  }, [addLog]);

  return { logs: filteredLogs, isLoading, log, clearLogs: clearLogs.mutate, searchTerm, setSearchTerm };
}
export default useLogsReal;
