import type { MatchDetail } from "@/lib/types";
import { MatchEvents } from "./MatchEvents";
import { MatchStats } from "./MatchStats";
import { Chat } from "./Chat";
import { ConnectionStatus } from "./ConnectionStatus";

interface MatchDetailProps {
  match: MatchDetail;
}

export function MatchDetail({ match }: MatchDetailProps) {
  const isLive =
    match.status === "FIRST_HALF" || match.status === "SECOND_HALF";

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg py-2 px-3 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-600">Match Details</h1>
            <div className="flex items-center mt-2">
              <ConnectionStatus />
              {isLive && (
                <span className="ml-4 flex items-center text-green-600 font-semibold">
                  <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </span>
              )}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm text-gray-500">Minute</div>
            <div className="md:text-2xl text-xl font-bold">{match.minute}'</div>
            <div className="text-sm text-gray-500 capitalize">
              {match.status.replace("_", " ").toLowerCase()}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-8">
          <div className="text-center flex-1">
            <div className="md:text-xl text-sm font-bold text-gray-600">
              {match.homeTeam.name}
            </div>
            <div className="text-sm text-gray-600">
              {match.homeTeam.shortName}
            </div>
          </div>

          <div className="mx-8 flex items-center">
            <div className="md:text-3xl text-xl font-bold text-gray-600 mx-4">
              {match.homeScore}
            </div>
            <div className="md:text-3xl text-xl text-gray-400">-</div>
            <div className="md:text-3xl text-xl  font-bold mx-4">
              {match.awayScore}
            </div>
          </div>

          <div className="text-center flex-1">
            <div className="md:text-xl text-sm font-bold text-gray-600">
              {match.awayTeam.name}
            </div>
            <div className="text-sm text-gray-600">
              {match.awayTeam.shortName}
            </div>
          </div>
        </div>

        {isLive && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(match.minute / 90) * 100}%` }}
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow md:p-6 p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-600">
              Match Events
            </h2>
            <MatchEvents events={match.events} />
          </div>

          <div className="bg-white rounded-lg shadow md:p-6 p-4">
            <h2 className="text-xl font-bold mb-4 text-gray-600">Statistics</h2>
            <MatchStats statistics={match.statistics} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Live Chat</h2>
          <Chat matchId={match.id} />
        </div>
      </div>
    </div>
  );
}
