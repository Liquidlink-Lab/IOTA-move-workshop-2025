import { GameActions } from "./game-actions";
import { HeroTest } from "./hero-test";
import { Leaderboard } from "./leaderboard";
import { PlayerStats } from "./player-stats";
import Wallet from "./wallet";
import Whitelist from "./whitelist";
import { Whitelist as WithelistTest } from "./whitelist-test";

export function GameDashboard() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-4 text-balance">
          Welcome to{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-accent to-secondary">
            LiquidQuest
          </span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
          Battle, collect, and earn rewards in the ultimate GameFi experience
        </p>
      </section>

      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap gap-4">
          <PlayerStats />
        </div>
        <section className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 w-full flex flex-col gap-6">
            <GameActions />
            <Leaderboard />
          </div>
          <div className="flex-1 w-full lg:max-w-xl flex flex-col gap-6">
            <Wallet />
            <Whitelist />
            {/* <WithelistTest /> */}
            <HeroTest />
          </div>
        </section>
      </div>
    </div>
  );
}
