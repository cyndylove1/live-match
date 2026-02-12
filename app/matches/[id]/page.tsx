"use client";

import { useParams, useRouter } from "next/navigation";
import { useMatchDetail } from "@/hooks/useMatchDetail";
import { MatchDetail as MatchDetailComponent } from "@/components/MatchDetails";
import { useEffect } from "react";
import Link from "next/link";

export default function MatchPage() {
  const params = useParams();
  const router = useRouter();
  const matchId = params.id as string;

  const { match, loading, error, refreshMatch } = useMatchDetail(matchId);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading match details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-500 text-xl font-semibold mb-2">Error</div>
        <div className="text-gray-600 mb-4">{error}</div>
        <div className="space-x-4">
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Go Back
          </button>
          <button
            onClick={refreshMatch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-xl mb-4">Match not found</div>
        <Link
          href="/"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Back to Matches
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-blue-600 hover:text-blue-800"
        >
          ← Back to all matches
        </Link>
      </div>

      <MatchDetailComponent match={match} />
    </div>
  );
}
