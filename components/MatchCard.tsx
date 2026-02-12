import { Match, MatchStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface MatchCardProps {
  match: Match;
  onClick?: () => void;
}

const statusConfig: Record<
  MatchStatus,
  { label: string; color: string; bgColor: string }
> = {
  NOT_STARTED: {
    label: "Upcoming",
    color: "text-gray-600",
    bgColor: "bg-gray-100",
  },
  FIRST_HALF: {
    label: "Live",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  HALF_TIME: {
    label: "HT",
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
  },
  SECOND_HALF: {
    label: "Live",
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  FULL_TIME: { label: "FT", color: "text-red-600", bgColor: "bg-red-100" },
};

export function MatchCard({ match, onClick }: MatchCardProps) {
  const status = statusConfig[match.status];
  const isLive =
    match.status === "FIRST_HALF" || match.status === "SECOND_HALF";

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow cursor-pointer border",
        isLive ? "border-green-500 border-2" : "border-gray-200",
      )}
    >
      <div className="flex justify-between items-center mb-2">
        <span
          className={cn(
            "text-xs font-semibold px-2 py-1 rounded",
            status.color,
            status.bgColor,
          )}
        >
          {isLive ? `${match.minute}'` : status.label}
        </span>
        <span className="text-sm font-[600] text-gray-500">
          {new Date(match.startTime).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex-1 text-right">
          <div className="font-[600] text-sm">{match.homeTeam.name}</div>
          <div className="text-sm font-[600] text-gray-600">
            {match.homeTeam.shortName}
          </div>
        </div>

        <div className="mx-6 flex items-center">
          <div className="text-sm font-[600]">{match.homeScore}</div>
          <div className="text-gray-400">-</div>
          <div className="text-sm font-[600]">{match.awayScore}</div>
        </div>

        <div className="flex-1 text-left">
          <div className="font-semibold">{match.awayTeam.name}</div>
          <div className="text-sm text-gray-600">
            {match.awayTeam.shortName}
          </div>
        </div>
      </div>

      {isLive && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div
              className="bg-green-500 h-1 rounded-full transition-all duration-300"
              style={{ width: `${(match.minute / 90) * 100}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-1 text-center">
            {match.status === "FIRST_HALF" ? "First Half" : "Second Half"}
          </div>
        </div>
      )}
    </div>
  );
}
