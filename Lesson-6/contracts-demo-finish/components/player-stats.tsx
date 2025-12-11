"use client";

import { Card } from "@/components/ui/card";
import { Trophy, Coins } from "lucide-react";

const stats = [
  {
    label: "Total Points",
    value: "12,450",
    icon: Trophy,
    color: "text-primary",
  },
  {
    label: "Liquid Tokens",
    value: "8,920",
    icon: Coins,
    color: "text-secondary",
  },
];

export function PlayerStats() {
  return stats.map((stat) => {
    const Icon = stat.icon;
    return (
      <Card
        key={stat.label}
        className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105 flex-1 min-w-[140px]"
      >
        <div className="flex items-start justify-between mb-3">
          <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
            <Icon className="w-5 h-5" />
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground mb-1">
            {stat.value}
          </p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </div>
      </Card>
    );
  });
}
