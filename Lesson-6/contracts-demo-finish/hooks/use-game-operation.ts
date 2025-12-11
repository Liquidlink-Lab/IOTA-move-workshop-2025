import {
  useCurrentAccount,
  useIotaClient,
  useIotaClientContext,
  useSignAndExecuteTransaction,
} from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";
import { toast } from "sonner";

import { OBJECT_HERO, HERO_PRICE, EQUIPMENT_PRICE } from "@/consts";
import { useHeroInventory } from "./use-hero-inventory";

export const useGameOperation = () => {
  const client = useIotaClient();
  const currentAccount = useCurrentAccount();
  const currentAddress = currentAccount?.address ?? "";
  const { heroObjects } = useHeroInventory();
  const { network } = useIotaClientContext();
  const { mutateAsync: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();
  const OBJECT_HERO_PACKAGE_ID = OBJECT_HERO[network].originPackage ?? "";
  const GAME_TREASURY_CAP = OBJECT_HERO[network].gameTreasuryCap ?? "";
  const COIN_TYPE_HEROC = `${OBJECT_HERO_PACKAGE_ID}::heroc_token::HEROC_TOKEN`;
  const FIGHTLIST = OBJECT_HERO[network].fightList ?? "";

  const getPaymentCoin = async (tx: Transaction, requestAmount: number) => {
    const { data: coins } = await client.getCoins({
      owner: currentAddress,
      coinType: COIN_TYPE_HEROC,
    });

    if (!coins.length) {
      throw new Error("No HEROC tokens available for payment");
    }

    const totalBalance = coins.reduce(
      (acc, coin) => acc + BigInt(coin.balance),
      BigInt(0)
    );

    if (totalBalance < requestAmount) {
      throw new Error("Not enough HEROC");
    }

    const [primaryCoin, ...mergeCoins] = coins;
    const primaryCoinInput = tx.object(primaryCoin.coinObjectId);

    if (mergeCoins.length) {
      tx.mergeCoins(
        primaryCoinInput,
        mergeCoins.map((coin) => tx.object(coin.coinObjectId))
      );
    }

    return tx.splitCoins(primaryCoinInput, [requestAmount]);
  };

  const createHero = async () => {
    try {
      const tx = new Transaction();
      const paymentCoin = await getPaymentCoin(tx, HERO_PRICE);

      tx.moveCall({
        target: `${OBJECT_HERO_PACKAGE_ID}::hero::create_hero`,
        arguments: [
          tx.object("0x8"),
          tx.object(GAME_TREASURY_CAP),
          paymentCoin,
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });

      toast.success("Hero created successfully!");
    } catch (error) {
      error instanceof Error &&
        toast.error(`Failed to create hero: ${error.message}`);
    }
  };

  const forgeEquipment = async (type: "sword" | "shield") => {
    try {
      const tx = new Transaction();
      const paymentCoin = await getPaymentCoin(tx, EQUIPMENT_PRICE);

      tx.moveCall({
        target: `${OBJECT_HERO_PACKAGE_ID}::hero::create_${type}`,
        arguments: [
          paymentCoin,
          tx.object(GAME_TREASURY_CAP),
          tx.object("0x8"),
        ],
      });

      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });

      toast.success(`${type} forged successfully!`);
    } catch (error) {
      error instanceof Error &&
        toast.error(`Failed to forge ${type}: ${error.message}`);
    }
  };

  const attackBoss = async () => {
    try {
      const tx = new Transaction();
      tx.moveCall({
        target: `${OBJECT_HERO_PACKAGE_ID}::hero::attack_the_boss`,
        arguments: [
          tx.object("0x6"),
          tx.object("0x8"),
          tx.object(GAME_TREASURY_CAP),
          tx.object(heroObjects[0].id),
          tx.object(FIGHTLIST),
        ],
      });
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });

      toast.success("Boss attacked successfully!");
    } catch (error) {
      error instanceof Error &&
        toast.error(`Failed to attack boss: ${error.message}`);
    }
  };

  return { createHero, forgeEquipment, attackBoss, isPending };
};
