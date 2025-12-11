"use client";

import { useEffect, useState } from "react";

const CHARACTERS = ["🎮", "💎", "⚔️", "🛡️", "🏆", "⭐", "💫", "🎯"] as const;

type CharacterStyle = {
  left: string;
  top: string;
  animationDuration: string;
};

export function FloatingCharacters() {
  const [styles, setStyles] = useState<CharacterStyle[]>([]);

  useEffect(() => {
    setStyles(
      CHARACTERS.map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }))
    );
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {styles.map((style, i) => (
        <div
          key={i}
          className="absolute text-4xl opacity-20 animate-float"
          style={{
            ...style,
            animationDelay: `${i * 0.5}s`,
          }}
        >
          {CHARACTERS[i]}
        </div>
      ))}
    </div>
  );
}
