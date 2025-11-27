import { GameDashboard } from "@/components/game-dashboard";
import { GameHeader } from "@/components/game-header";
import { FloatingCharacters } from "@/components/floating-characters";
import { GameFooter } from "@/components/game-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/25 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/15 rounded-full blur-[150px] pointer-events-none" />

      <FloatingCharacters />

      <div className="relative z-10">
        <GameHeader />
        <main className="container mx-auto px-4 py-8 min-h-[60vh]">
          <GameDashboard />
        </main>
        <GameFooter />
      </div>
    </div>
  );
}
