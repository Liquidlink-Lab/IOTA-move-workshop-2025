"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { useIotaClient, useSignAndExecuteTransaction } from "@iota/dapp-kit";
import { IOTA_TYPE_ARG, parseAmount } from "@iota/iota-sdk/utils";
import { Loader2, Send, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  useSendByAmountOrAll,
  type SendAmountMode,
} from "@/hooks/use-send-by-amount-or-all";
import type useTokens from "@/hooks/useTokens";

type TokenInfo = ReturnType<typeof useTokens>["tokens"][number];

type WalletSendProps = {
  token: TokenInfo;
  sender: string;
  network: string;
  onClose: () => void;
  onSent: () => void;
};

const WalletSend = ({
  token,
  sender,
  network,
  onClose,
  onSent,
}: WalletSendProps) => {
  const client = useIotaClient();
  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [isSendAll, setIsSendAll] = useState(false);
  const [isSendingTx, setIsSendingTx] = useState(false);

  const decimals = token.decimals ?? 0;
  const trimmedRecipient = recipient.trim();

  const sendMode: SendAmountMode = isSendAll
    ? { type: "all" }
    : { type: "amount", amount: amount.trim() };

  const { buildTransaction, canBuild } = useSendByAmountOrAll({
    coinType: token.coinType,
    coinDecimals: token.decimals ?? -1,
    senderAddress: sender,
    recipientAddress: trimmedRecipient,
    mode: sendMode,
  });

  const balanceNumber = useMemo(() => {
    if (!token.balance) return null;
    const parsed = Number(token.balance.replace(/,/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }, [token.balance]);

  const isIota = token.coinType === IOTA_TYPE_ARG;
  const maxDisplay = useMemo(
    () => (token.balance ? `${isIota ? "~" : ""}${token.balance}` : "--"),
    [isIota, token.balance]
  );

  const amountInSmallestUnit = useMemo(() => {
    if (decimals < 0) return "";

    const sourceAmount = isSendAll
      ? token.balance?.replace(/,/g, "") ?? ""
      : amount.trim();

    if (!sourceAmount) return "";

    try {
      const smallest = parseAmount(sourceAmount, decimals);
      if (typeof smallest === "bigint") {
        return smallest.toLocaleString("en-US");
      }
      return BigInt(smallest).toLocaleString("en-US");
    } catch {
      return "";
    }
  }, [amount, decimals, isSendAll, token.balance]);

  const resetForm = () => {
    setRecipient("");
    setAmount("");
    setIsSendAll(false);
  };

  useEffect(() => {
    // Reset when switching token or network to avoid stale data.
    resetForm();
  }, [token.coinType, network]);

  const handleAmountChange = (value: string) => {
    setIsSendAll(false);
    const cleaned = value.replace(/[^0-9.]/g, "");
    const [head, ...rest] = cleaned.split(".");
    const normalized = rest.length ? `${head}.${rest.join("")}` : head;
    const numeric = Number(normalized || "0");
    const safeValue =
      balanceNumber !== null && numeric > balanceNumber
        ? String(balanceNumber)
        : normalized;
    setAmount(safeValue);
  };

  const handleMax = () => {
    setIsSendAll(true);
    setAmount("");
  };

  const handleSend = async () => {
    if (!canBuild) {
      toast.error("請輸入收件地址與金額");
      return;
    }

    try {
      setIsSendingTx(true);
      const { transaction } = await buildTransaction();

      const result = await signAndExecuteTransaction({
        transaction,
        chain: `iota:${network}`,
      });

      await client.waitForTransaction({ digest: result.digest });
      toast.success(
        `已送出 ${isSendAll ? "全部" : amount} ${token.symbol ?? "tokens"}`
      );
      onSent();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Send failed");
    } finally {
      setIsSendingTx(false);
    }
  };

  return (
    <div className="mt-4 rounded-xl border border-primary/30 bg-background/90 px-4 py-4 shadow-lg space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs text-muted-foreground">Sending</p>
          <p className="text-sm font-semibold text-foreground">
            {token.name ?? token.symbol ?? "Token"}
          </p>
          <p className="text-xs text-muted-foreground">
            Balance: {token.balance ?? "--"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => {
            onClose();
            resetForm();
          }}
          aria-label="Close send panel"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground">
          Recipient address
        </label>
        <input
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="address"
          className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs text-muted-foreground">Amount</label>
          <Button size="sm" variant="outline" onClick={handleMax}>
            Max
          </Button>
        </div>
        <div className="relative">
          <input
            value={isSendAll ? maxDisplay : amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            placeholder="0.0"
            className="w-full rounded-lg border border-border bg-background/70 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-60"
          />
          {isSendAll ? (
            <span className="absolute inset-y-0 right-3 flex items-center text-xs text-muted-foreground">
              全部
            </span>
          ) : null}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {token.symbol ?? ""} has {decimals >= 0 ? decimals : "--"} decimals
        </p>
        <p className="text-[11px] text-muted-foreground">
          In smallest unit: {amountInSmallestUnit || "--"}
        </p>
      </div>

      <Button
        className="w-full gap-2"
        onClick={handleSend}
        disabled={!canBuild || isSendingTx}
      >
        {isSendingTx ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Send className="h-4 w-4" />
        )}
        Send
      </Button>
    </div>
  );
};

export default WalletSend;
