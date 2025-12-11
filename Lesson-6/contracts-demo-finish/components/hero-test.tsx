"use client";

import { useHeroInventory } from "@/hooks/use-hero-inventory";

export const HeroTest = () => {
  const { heroObjects, swordObjects, shieldObjects } = useHeroInventory();
  console.log(
    "🚀 ~ HeroTest ~ heroObjects, swordObjects, shieldObjects:",
    heroObjects,
    swordObjects,
    shieldObjects
  );

  return <></>;
};
