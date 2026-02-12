import { MatchEvent } from "@/lib/types";

interface MatchEventsProps {
  events: MatchEvent[];
}

const eventConfig: Record<string, { icon: string; color: string; bg: string }> =
  {
    GOAL: {
      icon: "⚽",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    YELLOW_CARD: {
      icon: "•",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    RED_CARD: {
      icon: "•",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    SUBSTITUTION: {
      icon: "•",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    FOUL: {
      icon: "•",
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    SHOT: {
      icon: "•",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  };

export function MatchEvents({ events }: MatchEventsProps) {
  if (!events || events.length === 0) {
    return <div className="text-center py-8 text-gray-500">No events yet</div>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {events.map((event) => {
        const config = eventConfig[event.type?.toUpperCase()] || {
          icon: "•",
          color: "text-gray-600",
          bg: "bg-gray-100",
        };

        return (
          <div
            key={event.id}
            className="flex items-start md:p-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {/* Icon & Minute */}
            <div className="flex-shrink-0 w-12">
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${config.bg}`}
                >
                  <span
                    className={`${config.color} text-lg font-semibold leading-none`}
                  >
                    {config.icon}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {event.minute}'
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="ml-4 flex-1">
              <div className="font-medium text-gray-700">
                {event.description}
              </div>

              <div className="text-sm text-gray-600 mt-1">
                {event.player}
                {event.assistPlayer && ` (assist: ${event.assistPlayer})`}
              </div>

              <div className="text-xs text-gray-500 mt-1">
                {new Date(event.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Team Badge */}
            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${
                event.team === "home"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {event.team === "home" ? "HOME" : "AWAY"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
