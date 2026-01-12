// V19-HE002: useHealth Real Expandido
import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { healthServiceReal } from "@/services/healthService.real";

export function useHealthReal(intervalMs: number = 30000) {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const { data: health, refetch, isLoading } = useQuery({
    queryKey: ["health"],
    queryFn: () => healthServiceReal.check(),
    refetchInterval: intervalMs,
    staleTime: intervalMs / 2
  });

  const { data: metrics } = useQuery({
    queryKey: ["health-metrics"],
    queryFn: () => healthServiceReal.getMetrics(),
    refetchInterval: intervalMs * 2
  });

  const { data: version } = useQuery({
    queryKey: ["health-version"],
    queryFn: () => healthServiceReal.getVersion(),
    staleTime: Infinity
  });

  useEffect(() => {
    if (health) setLastCheck(new Date());
  }, [health]);

  const forceCheck = useCallback(async () => {
    const result = await refetch();
    return result.data;
  }, [refetch]);

  return {
    status: health?.status || "unknown",
    checks: health?.checks || [],
    metrics,
    version,
    lastCheck,
    isLoading,
    forceCheck,
    isHealthy: health?.status === "healthy"
  };
}
export default useHealthReal;
