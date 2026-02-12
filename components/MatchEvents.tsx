import { MatchEvent } from "@/lib/types";

interface MatchEventsProps {
  events: MatchEvent[];
}

const eventConfig: Record<
  string,
  { icon: string; color: string;}
> = {
  GOAL: { icon: "⚽", color: "text-green-600"},
  YELLOW_CARD: {
    icon: "🟨",
    color: "text-yellow-600",
  },
  RED_CARD: { icon: "🟥", color: "text-red-600"},
  SUBSTITUTION: { icon: "🔄", color: "text-blue-600"},
  FOUL: { icon: "⚠️", color: "text-orange-600"},
  SHOT: { icon: "🎯", color: "text-purple-600"},
};

export function MatchEvents({ events }: MatchEventsProps) {
  if (events.length === 0) {
    return <div className="text-center py-8 text-gray-500">No events yet</div>;
  }

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {events.map((event) => {
        const config = eventConfig[event.type] || {
          icon: "•",
          color: "text-gray-600",
          bgColor: "bg-gray-100",
        };

        return (
          <div
            key={event.id}
            className="flex items-start md:p-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-12">
              <div className="text-center">
                <div
                  className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${config.color}`}
                >
                  {config.icon}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {event.minute}'
                </div>
              </div>
            </div>

            <div className="ml-4 flex-1">
              <div className="font-medium">{event.description}</div>
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

            <div
              className={`text-xs font-semibold px-2 py-1 rounded ${event.team === "home" ? "bg-blue-100 text-blue-800" : "bg-red-100 text-red-800"}`}
            >
              {event.team === "home" ? "HOME" : "AWAY"}
            </div>
          </div>
        );
      })}
    </div>
  );
}
