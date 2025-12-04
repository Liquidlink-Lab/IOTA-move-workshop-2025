"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useCurrentAccount,
  useIotaClient,
  useIotaClientContext,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import type { LucideIcon } from "lucide-react";
import { Anvil, Coins, Sparkles, Gem, Sword, Skull, Wand2 } from "lucide-react";
import { toast } from "sonner";

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

const DEMO_LESSON_3_PACKAGE_ID =
  process.env.NEXT_PUBLIC_DEMO_LESSON_3_PACKAGE_ID;

export function GameActions() {
  const { network } = useIotaClientContext();
  const currentAccount = useCurrentAccount();
  const client = useIotaClient();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();

  const placeholder = (label: string) => () => {
    toast.info(`${label} 邏輯尚未實作`);
  };

  const handleAction = (action: GameAction) => {
    action.onAction?.();
  };

  const actions: GameAction[] = [
    {
      id: "claim",
      name: "每日提領代幣",
      icon: Coins,
      color: "from-yellow-500 to-amber-600",
      description: "領取每日獎勵",
      disabled: true,
      onAction: placeholder("每日提領代幣"),
    },
    {
      id: "summon",
      name: "召喚人物",
      icon: Sparkles,
      color: "from-primary to-accent",
      description: "召喚新角色",
      disabled: false,
      onAction: placeholder("召喚人物"),
    },
    {
      id: "forge-gem",
      name: "鑄造寶石",
      icon: Gem,
      color: "from-cyan-500 to-blue-600",
      description: "合成強化寶石",
      disabled: true,
      onAction: placeholder("鑄造寶石"),
    },
    {
      id: "forge-weapon",
      name: "鑄造武器",
      icon: Sword,
      color: "from-red-500 to-orange-600",
      description: "打造傳奇武器",
      disabled: true,
      onAction: placeholder("鑄造武器"),
    },
    {
      id: "battle",
      name: "挑戰怪物",
      icon: Skull,
      color: "from-purple-500 to-pink-600",
      description: "進入戰鬥",
      disabled: true,
      onAction: placeholder("挑戰怪物"),
    },
    {
      id: "enchant",
      name: "附魔升級裝備",
      icon: Wand2,
      color: "from-green-500 to-emerald-600",
      description: "強化裝備屬性",
      disabled: true,
      onAction: placeholder("附魔升級裝備"),
    },
    {
      id: "demo_mint",
      name: "Demo Mint NFT",
      icon: Anvil,
      color: "from-blue-500 to-blue-900",
      description: "Demo Mint NFT",
      disabled: false,
      onAction: () => {
        if (!currentAccount) {
          return toast.error("請先連接錢包");
        }

        const tx = new Transaction();

        tx.moveCall({
          target: `${DEMO_LESSON_3_PACKAGE_ID}::testnft::mint_to_sender`,
          arguments: [
            tx.pure.vector(
              "u8",
              Array.from(new TextEncoder().encode("IOTA Hero Demo"))
            ),
            tx.pure.vector(
              "u8",
              Array.from(new TextEncoder().encode("It's Demo Time!"))
            ),
            tx.pure.vector(
              "u8",
              Array.from(
                new TextEncoder().encode(
                  "https://iota.liquidlink.io/avatars/nft.png"
                )
              )
            ),
          ],
          typeArguments: [],
        });

        signAndExecuteTransaction(
          {
            transaction: tx,
            chain: `iota:${network}`,
          },
          {
            onSuccess: async (result) => {
              await client.waitForTransaction({ digest: result.digest });
              toast.success("[Demo] Minted NFT success");
            },
          }
        );
      },
    },
  ];

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
    </Card>
  );
}
