"use client";

import { Card } from "@/components/ui/card";
import { useLeaderboard } from "@/hooks/use-leaderboard";
import { Trophy, Medal, Loader2 } from "lucide-react";

const shortAddress = (address: string) =>
  address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

export function Leaderboard() {
  const { data: leaderboard, isLoading } = useLeaderboard();

  return (
    <Card
      className="p-8 bg-card/50 backdrop-blur-sm border-border/50"
      id="leaderboard"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-linear-to-br from-primary to-accent">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-foreground">
              Lesson 5: Leaderboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Top players this season (live from FightList)
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>載入排行榜...</span>
          </div>
        ) : (
          leaderboard?.ranking.map((player) => (
            <div
              key={player.rank}
              className={`flex items-center justify-between p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                player.isYou
                  ? "bg-primary/10 border-primary/50 animate-pulse-glow"
                  : "bg-muted/30 border-border/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="flex items-center justify-center w-12">
                  {player.rank <= 3 ? (
                    <div
                      className={`text-2xl ${
                        player.rank === 1
                          ? "text-warning"
                          : player.rank === 2
                          ? "text-muted-foreground"
                          : "text-warning/60"
                      }`}
                    >
                      <Medal className="w-8 h-8" />
                    </div>
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground">
                      #{player.rank}
                    </span>
                  )}
                </div>

                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-accent flex items-center justify-center text-2xl">
                  {player.avatar}
                </div>

                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {shortAddress(player.address)}
                    {player.isYou ? " (You)" : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {player.points.toLocaleString()} points
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
