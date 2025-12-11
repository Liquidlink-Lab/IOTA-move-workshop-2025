"use client";

import { useEffect, useMemo } from "react";

import {
  useCurrentAccount,
  useIotaClientContext,
  useIotaClientInfiniteQuery,
} from "@iota/dapp-kit";
import { OBJECT_HERO } from "@/consts";

type OwnedObject = {
  id: string;
  type: string;
  content?: unknown;
};

type HeroInventory = {
  hero: OwnedObject[];
  sword: OwnedObject[];
  shield: OwnedObject[];
};

const emptyInventory: HeroInventory = { hero: [], sword: [], shield: [] };

export const useHeroInventory = () => {
  const currentAccount = useCurrentAccount();
  const currentAddress = currentAccount?.address ?? "";
  const { network } = useIotaClientContext();
  const packageId = OBJECT_HERO[network].originPackage ?? "";
  const heroType = packageId ? `${packageId}::hero::Hero` : "";
  const swordType = packageId ? `${packageId}::hero::Sword` : "";
  const shieldType = packageId ? `${packageId}::hero::Shield` : "";

  const {
    data,
    fetchNextPage,
    hasNextPage,
    refetch,
    isFetching,
    isFetchingNextPage,
    isFetched,
    isPending,
  } = useIotaClientInfiniteQuery(
    "getOwnedObjects",
    {
      owner: currentAddress ?? "",
      options: { showType: true, showContent: true },
      limit: 50,
      filter: {
        MatchAny: [
          {
            StructType: heroType,
          },
          {
            StructType: swordType,
          },
          {
            StructType: shieldType,
          },
        ],
      },
    },
    {
      enabled: Boolean(currentAddress && packageId),
    }
  );

  useEffect(() => {
    if (!currentAddress || !packageId) return;
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [
    currentAddress,
    packageId,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  ]);

  const inventory = useMemo(() => {
    if (!heroType || !swordType || !shieldType) return emptyInventory;
    const pages = data?.pages ?? [];
    const objects = pages.flatMap((page) => page.data ?? []);

    return objects.reduce<HeroInventory>(
      (acc, item) => {
        const objectData = item.data;
        const type = objectData?.type;
        const id = objectData?.objectId;
        if (!type || !id) return acc;

        const entry = {
          id,
          type,
          content: objectData?.content,
        };

        if (type === heroType) acc.hero.push(entry);
        if (type === swordType) acc.sword.push(entry);
        if (type === shieldType) acc.shield.push(entry);
        return acc;
      },
      { hero: [], sword: [], shield: [] }
    );
  }, [data, heroType, shieldType, swordType]);

  return {
    heroObjects: inventory.hero,
    swordObjects: inventory.sword,
    shieldObjects: inventory.shield,
    hasHero: inventory.hero.length > 0,
    hasSword: inventory.sword.length > 0,
    hasShield: inventory.shield.length > 0,
    isLoading: isFetching || isPending || isFetchingNextPage,
    isFetched,
    refetch,
  };
};
