import { useState, useEffect, useCallback} from "react";
import { MatchDetail, MatchEvent} from "@/lib/types";
import { api } from "@/lib/api";
import { socket } from "@/lib/socket";
import { toast } from "react-toastify";

export function useMatchDetail(matchId: string) {
  const [match, setMatch] = useState<MatchDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMatchDetail = useCallback(async () => {
    if (!matchId) return;

    try {
      setLoading(true);
      const data = await api.getMatchDetail(matchId);
      setMatch(data);
      setError(null);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch match details";

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [matchId]);

  const handleScoreUpdate = useCallback(
    (data: any) => {
      if (data.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? { ...prev, homeScore: data.homeScore, awayScore: data.awayScore }
            : null,
        );
      }
    },
    [matchId],
  );

  const handleMatchEvent = useCallback(
    (data: any) => {
      if (data.matchId === matchId) {
        const newEvent: MatchEvent = {
          id: Date.now().toString(),
          type: data.type,
          minute: data.minute,
          team: data.team,
          player: data.player,
          description: data.description,
          timestamp: new Date().toISOString(),
          ...(data.assistPlayer && { assistPlayer: data.assistPlayer }),
        };

        setMatch((prev) =>
          prev
            ? {
                ...prev,
                events: [newEvent, ...prev.events],
              }
            : null,
        );
      }
    },
    [matchId],
  );

  const handleStatsUpdate = useCallback(
    (data: any) => {
      if (data.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                statistics: data.statistics,
              }
            : null,
        );
      }
    },
    [matchId],
  );

  const handleStatusChange = useCallback(
    (data: any) => {
      if (data.matchId === matchId) {
        setMatch((prev) =>
          prev
            ? {
                ...prev,
                status: data.status,
                minute: data.minute,
              }
            : null,
        );
      }
    },
    [matchId],
  );

  useEffect(() => {
    fetchMatchDetail();

    socket.subscribeMatch(matchId);

    // Set up real-time listeners with memoized handlers
    socket.on("score_update", handleScoreUpdate);
    socket.on("match_event", handleMatchEvent);
    socket.on("stats_update", handleStatsUpdate);
    socket.on("status_change", handleStatusChange);

    return () => {
      socket.unsubscribeMatch(matchId);
      socket.off("score_update", handleScoreUpdate);
      socket.off("match_event", handleMatchEvent);
      socket.off("stats_update", handleStatsUpdate);
      socket.off("status_change", handleStatusChange);
    };
  }, [
    matchId,
    fetchMatchDetail,
    handleScoreUpdate,
    handleMatchEvent,
    handleStatsUpdate,
    handleStatusChange,
  ]);

  const refreshMatch = useCallback(() => {
    fetchMatchDetail();
  }, [fetchMatchDetail]);

  return {
    match,
    loading,
    error,
    refreshMatch,
  };
}
