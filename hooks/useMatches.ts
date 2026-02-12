
import { useState, useEffect, useCallback, useRef } from "react";
import { Match } from "@/lib/types";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";

export function useMatches(autoRefresh = false) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.getMatches();
      setMatches(response.matches);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load matches";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh logic - 
  useEffect(() => {
    if (!autoRefresh) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      fetchMatches();
    }, 30000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [autoRefresh, fetchMatches]);

  // Initial fetch and real-time updates
  useEffect(() => {
    fetchMatches();

    // Set up real-time updates
    const handleScoreUpdate = (data: any) => {
      setMatches((prev) =>
        prev.map((match) =>
          match.id === data.matchId
            ? { ...match, homeScore: data.homeScore, awayScore: data.awayScore }
            : match,
        ),
      );
    };

    const handleStatusChange = (data: any) => {
      setMatches((prev) =>
        prev.map((match) =>
          match.id === data.matchId
            ? { ...match, status: data.status, minute: data.minute }
            : match,
        ),
      );
    };

    socket.on("score_update", handleScoreUpdate);
    socket.on("status_change", handleStatusChange);

    return () => {
      socket.off("score_update", handleScoreUpdate);
      socket.off("status_change", handleStatusChange);
    };
  }, [fetchMatches]);

  const refreshMatches = useCallback(() => {
    fetchMatches();
  }, [fetchMatches]);

  return {
    matches,
    loading,
    error,
    refreshMatches,
  };
}
