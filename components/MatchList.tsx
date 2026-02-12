import { Match } from "@/lib/types";
import { MatchCard } from "./MatchCard";
import { useRouter } from "next/navigation";

interface MatchListProps {
  matches: Match[];
  loading?: boolean;
  error?: string | null;
}

export function MatchList({ matches, loading, error }: MatchListProps) {
  const router = useRouter();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-2">Error loading matches</div>
        <div className="text-gray-600 text-sm">{error}</div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">No matches available</div>
      </div>
    );
  }

  // Group matches by ALL possible statuses
  const notStartedMatches = matches.filter((m) => m.status === "NOT_STARTED");
  const firstHalfMatches = matches.filter((m) => m.status === "FIRST_HALF");
  const halfTimeMatches = matches.filter((m) => m.status === "HALF_TIME");
  const secondHalfMatches = matches.filter((m) => m.status === "SECOND_HALF");
  const fullTimeMatches = matches.filter((m) => m.status === "FULL_TIME");

  return (
    <div className="space-y-8">
      {/* Not Started */}
      {notStartedMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-600">
            Upcoming Matches ({notStartedMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notStartedMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* First Half */}
      {firstHalfMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            First Half ({firstHalfMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {firstHalfMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Half Time */}
      {halfTimeMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-yellow-600">
            Half Time ({halfTimeMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {halfTimeMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Second Half */}
      {secondHalfMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-green-600 flex items-center">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
            Second Half ({secondHalfMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {secondHalfMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Full Time */}
      {fullTimeMatches.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4 text-gray-600">
            Completed Matches ({fullTimeMatches.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {fullTimeMatches.map((match) => (
              <MatchCard
                key={match.id}
                match={match}
                onClick={() => router.push(`/matches/${match.id}`)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
