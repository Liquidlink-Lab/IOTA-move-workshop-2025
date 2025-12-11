"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import ConnectInfo from "./connect-info";

const navItems = [
  { href: "#game", label: "Game" },
  { href: "#leaderboard", label: "Leaderboard" },
  { href: "#rewards", label: "Rewards" },
  { href: "#marketplace", label: "Marketplace" },
];

export function GameHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-lg font-bold">L</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">
                Liquid<span className="text-primary">link</span> GameFi
              </h1>
              <p className="text-xs text-muted-foreground">
                Play. Earn. Dominate.
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {navItems.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm text-foreground hover:text-primary transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <ConnectInfo />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {isMenuOpen && (
            <div
              id="mobile-nav"
              className="absolute top-full left-0 right-0 mt-3 rounded-xl border border-border/60 bg-background/95 shadow-lg md:hidden"
            >
              <div className="flex flex-col gap-2 p-4">
                {navItems.map(({ href, label }) => (
                  <a
                    key={href}
                    href={href}
                    className="rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted"
                    onClick={closeMenu}
                  >
                    {label}
                  </a>
                ))}
                <ConnectInfo />
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
