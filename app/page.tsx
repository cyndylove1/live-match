"use client";

import { Button } from "@/components/Button";
import { MatchList } from "@/components/MatchList";
import { useMatches } from "@/hooks/useMatches";

export default function Home() {
  const { matches, loading, error, refreshMatches } = useMatches(false);

  return (
    <div className="space-y-6 bg-white">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="md:text-3xl text-2xl font-bold text-gray-900">
            Live Matches
          </h1>
          <p className="text-gray-600 md:text-md text-sm mt-2">
            Real-time football match scores and statistics
          </p>
        </div>
        <Button
          onClick={refreshMatches}
          loading={loading}
          loadingText="Refreshing..."
          variant="primary"
        >
          Refresh
        </Button>
      </div>

      <MatchList matches={matches} loading={loading} error={error} />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-bold text-blue-800 mb-2">How it works:</h3>
        <ul className="text-blue-700 text-sm space-y-1">
          <li>• Matches update in real-time (1 second = 1 match minute)</li>
          <li>• Click on any match to view detailed statistics and chat</li>
          <li>• Green border indicates live matches</li>
          <li>• Chat with other fans in real-time</li>
        </ul>
      </div>
    </div>
  );
}
