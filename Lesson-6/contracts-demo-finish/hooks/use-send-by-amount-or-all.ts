import { useIotaClient } from "@iota/dapp-kit";
import { type CoinStruct } from "@iota/iota-sdk/client";
import {
  Transaction,
  TransactionObjectArgument,
} from "@iota/iota-sdk/transactions";
import {
  CoinFormat,
  IOTA_TYPE_ARG,
  formatBalance,
  isValidIotaAddress,
  parseAmount,
} from "@iota/iota-sdk/utils";
import { useCallback } from "react";

export interface SendCoinTransaction {
  transaction: Transaction;
}

export type SendAmountMode =
  | {
      type: "amount";
      amount: string;
    }
  | {
      type: "all";
    };

export interface UseSendByAmountOrAllParams {
  coins?: CoinStruct[];
  coinType: string;
  coinDecimals: number;
  senderAddress: string;
  recipientAddress: string;
  mode: SendAmountMode;
}

/**
 * Builds a transfer transaction for four scenarios:
 * 1) send a specific IOTA amount, 2) send all IOTA, 3) send a specific token amount, 4) send all of a token.
 */
export function useSendByAmountOrAll({
  coins,
  coinType,
  coinDecimals,
  senderAddress,
  recipientAddress,
  mode,
}: UseSendByAmountOrAllParams) {
  const client = useIotaClient();

  const recipientValid =
    !!recipientAddress && isValidIotaAddress(recipientAddress);

  const canBuild =
    recipientValid &&
    !!senderAddress &&
    !!coinType &&
    coinDecimals >= 0 &&
    (mode.type === "all" || !!mode.amount);

  const buildTransaction =
    useCallback(async (): Promise<SendCoinTransaction> => {
      if (!canBuild) {
        throw new Error("Transaction parameters are incomplete.");
      }

      const coinsOfType = coins?.length
        ? coins.filter((coin) => coin.coinType === coinType)
        : await fetchCoins(client, senderAddress, coinType);
      if (!coinsOfType.length) {
        throw new Error("No available coins for the selected token.");
      }

      const amountStr =
        mode.type === "all"
          ? formatBalance(
              sumCoinBalances(coinsOfType),
              coinDecimals,
              CoinFormat.Full
            ).replace(/,/g, "")
          : mode.amount;

      const transaction = createTokenTransferTransaction({
        coinType,
        coinDecimals,
        to: recipientAddress,
        amount: amountStr,
        coins: coinsOfType,
      });

      transaction.setSender(senderAddress);
      const txBytes = await transaction.build({ client });

      return {
        transaction: Transaction.from(txBytes),
      };
    }, [
      canBuild,
      client,
      coinDecimals,
      coinType,
      coins,
      mode,
      recipientAddress,
      senderAddress,
    ]);

  return {
    buildTransaction,
    canBuild,
  };
}

async function fetchCoins(
  client: ReturnType<typeof useIotaClient>,
  owner: string,
  coinType: string
) {
  const coins: CoinStruct[] = [];
  let cursor: string | null = null;

  do {
    const page = await client.getCoins({
      owner,
      coinType,
      cursor: cursor ?? undefined,
      limit: 200,
    });
    coins.push(...page.data);
    cursor = typeof page.nextCursor === "string" ? page.nextCursor : null;
  } while (cursor);

  return coins;
}

// --- Helpers below are kept in this file to keep the hook self-contained. ---

function sumCoinBalances(coins: CoinStruct[]): bigint {
  return coins.reduce((acc, coin) => acc + BigInt(coin.balance), BigInt(0));
}

function createTokenTransferTransaction({
  to,
  amount,
  coins,
  coinType,
  coinDecimals,
}: {
  to: string;
  amount: string;
  coins: CoinStruct[];
  coinType: string;
  coinDecimals: number;
}) {
  const tx = new Transaction();

  const totalBalance = coins.reduce((acc, { balance }) => {
    return BigInt(acc) + BigInt(balance);
  }, BigInt(0));

  const bigIntAmount = parseAmount(amount, coinDecimals);
  const isTransferAllObjects = totalBalance === bigIntAmount;

  if (coinType === IOTA_TYPE_ARG) {
    sendCoins(tx, to, tx.gas, isTransferAllObjects, bigIntAmount);
  } else {
    handleCoinTransfer(
      tx,
      to,
      coins,
      coinType,
      isTransferAllObjects,
      bigIntAmount
    );
  }

  return tx;
}

function handleCoinTransfer(
  tx: Transaction,
  to: string,
  coins: CoinStruct[],
  coinType: string,
  isTransferAllObjects: boolean,
  bigIntAmount: bigint
) {
  const [primaryCoin, ...mergeCoins] = coins.filter(
    (coin) => coin.coinType === coinType
  );
  const primaryCoinInput = tx.object(primaryCoin.coinObjectId);

  if (mergeCoins.length) {
    tx.mergeCoins(
      primaryCoinInput,
      mergeCoins.map((coin) => tx.object(coin.coinObjectId))
    );
  }
  sendCoins(tx, to, primaryCoinInput, isTransferAllObjects, bigIntAmount);
}

function sendCoins(
  tx: Transaction,
  to: string,
  coinObject: TransactionObjectArgument | string,
  isTransferAllObjects: boolean,
  bigIntAmount: bigint
) {
  if (isTransferAllObjects) {
    tx.transferObjects([coinObject], to);
  } else {
    const coin = tx.splitCoins(coinObject, [bigIntAmount]);
    tx.transferObjects([coin], to);
  }
}
