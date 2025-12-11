"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCurrentAccount, useIotaClientContext } from "@iota/dapp-kit";
import type { LucideIcon } from "lucide-react";
import {
  Anvil,
  Flame,
  Sparkles,
  Sword,
  Skull,
  X,
  Wand2,
  Gem,
  Coins,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { useNftTest } from "@/hooks/use-nft-test";
import { useGameOperation } from "@/hooks/use-game-operation";

type GameAction = {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
  disabled?: boolean;
  cooldown?: number;
  onAction?: () => void;
};

export function GameActions() {
  const { network } = useIotaClientContext();
  const currentAccount = useCurrentAccount();
  const [isBurnModalOpen, setIsBurnModalOpen] = useState(false);
  const [burningAddress, setBurningAddress] = useState("");
  const { mintNFT, burnNFT } = useNftTest();
  const { createHero, forgeEquipment, attackBoss } = useGameOperation();

  const placeholder = (label: string) => () => {
    toast.info(`${label} 邏輯尚未實作`);
  };

  const handleAction = (action: GameAction) => {
    action.onAction?.();
  };

  const actions: GameAction[] = [
    {
      id: "battle",
      name: "Daily Boss Battle",
      icon: Skull,
      color: "from-purple-500 to-pink-600",
      description: "Claim your daily rewards",
      disabled: false,
      onAction: () => {
        void attackBoss();
      },
    },
    {
      id: "summon",
      name: "Summon Hero",
      icon: Sparkles,
      color: "from-primary to-accent",
      description: "Bring a new character into the fight",
      disabled: false,
      onAction: () => {
        void createHero();
      },
    },
    {
      id: "forge-shield",
      name: "Forge Shield",
      icon: Shield,
      color: "from-cyan-500 to-blue-600",
      description: "Build a stalwart shield",
      disabled: false,
      onAction: () => {
        void forgeEquipment("shield");
      },
    },
    {
      id: "forge-weapon",
      name: "Forge Weapon",
      icon: Sword,
      color: "from-red-500 to-orange-600",
      description: "Craft a legendary weapon",
      disabled: false,
      onAction: () => {
        void forgeEquipment("sword");
      },
    },

    {
      id: "demo_mint",
      name: "Demo Mint NFT",
      icon: Anvil,
      color: "from-blue-500 to-blue-900",
      description: "Lessson 3 Demo Mint NFT",
      disabled: network !== "testnet",
      onAction: () => {
        if (!currentAccount) {
          return toast.error("請先連接錢包");
        }

        void mintNFT({
          onSuccess: (digest) => {
            toast.success(`Minted NFT success with digest: ${digest}`);
          },
          onError: (error) => {
            toast.error(`Minted NFT error: ${error}`);
          },
        });
      },
    },
    {
      id: "demo_burn",
      name: "Demo Burn NFT",
      icon: Flame,
      color: "from-red-500 to-red-900",
      description: "Lessson 3 Demo burn NFT",
      disabled: network !== "testnet",
      onAction: () => {
        if (!currentAccount) {
          return toast.error("請先連接錢包");
        }
        setIsBurnModalOpen(true);
      },
    },
  ];

  const closeBurnModal = () => {
    setIsBurnModalOpen(false);
    setBurningAddress("");
  };

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-primary/20">
      <h3 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-primary to-accent">
        遊戲功能
      </h3>
      <div className="flex flex-wrap gap-4">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Button
              key={action.id}
              onClick={() => handleAction(action)}
              disabled={action.disabled}
              className="h-auto flex-1 min-w-60 flex-col gap-3 p-6 relative overflow-hidden group transition-all duration-300 hover:scale-105"
              variant="outline"
            >
              <div
                className={`absolute inset-0 bg-linear-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />
              <div
                className={`p-3 rounded-full bg-linear-to-br ${action.color} shadow-lg group-hover:shadow-xl transition-shadow duration-300`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-center space-y-1">
                <div className="font-semibold text-sm">{action.name}</div>
                <div className="text-xs text-white/70">
                  {action.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {isBurnModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background/95 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Burn NFT
                </p>
                <p className="text-xs text-muted-foreground">
                  請輸入要銷毀的 NFT address
                </p>
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={closeBurnModal}
                aria-label="Close burn modal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-1">
              <label className="text-xs text-muted-foreground">
                NFT address
              </label>
              <input
                value={burningAddress}
                onChange={(e) => setBurningAddress(e.target.value)}
                placeholder="0x..."
                className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <Button
                className="flex-1"
                onClick={() =>
                  burnNFT({
                    nftId: burningAddress,
                    onSuccess: (digest) => {
                      toast.success(
                        `Burned NFT success with digest: ${digest}`
                      );
                      closeBurnModal();
                    },
                    onError: (error) => {
                      toast.error(`Burned NFT error: ${error}`);
                    },
                  })
                }
              >
                Burn
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={closeBurnModal}
              >
                取消
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Card>
  );
}
