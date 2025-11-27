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
    </div>
  );
}
