import { MatchStatistics } from "@/lib/types";

interface MatchStatsProps {
  statistics: MatchStatistics;
}

export function MatchStats({ statistics }: MatchStatsProps) {
  const stats = [
    { label: "Possession", value: statistics.possession, unit: "%", max: 100 },
    { label: "Shots", value: statistics.shots, unit: "" },
    { label: "Shots on Target", value: statistics.shotsOnTarget, unit: "" },
    { label: "Corners", value: statistics.corners, unit: "" },
    { label: "Fouls", value: statistics.fouls, unit: "" },
    { label: "Yellow Cards", value: statistics.yellowCards, unit: "" },
    { label: "Red Cards", value: statistics.redCards, unit: "" },
  ];

  return (
    <div className="space-y-4">
      {stats.map((stat) => {
        const total = stat.value.home + stat.value.away;
        const homePercentage = total > 0 ? (stat.value.home / total) * 100 : 50;

        return (
          <div key={stat.label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-600">{stat.label}</span>
              <span className="text-gray-500">
                {stat.value.home}
                {stat.unit} - {stat.value.away}
                {stat.unit}
              </span>
            </div>

            <div className="flex h-2 rounded-full overflow-hidden bg-gray-200">
              <div
                className="bg-blue-500 transition-all duration-300"
                style={{ width: `${homePercentage}%` }}
              />
              <div
                className="bg-red-500 transition-all duration-300"
                style={{ width: `${100 - homePercentage}%` }}
              />
            </div>

            <div className="flex justify-between text-xs text-gray-500">
              <span>{stat.value.home}</span>
              <span>{stat.value.away}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
