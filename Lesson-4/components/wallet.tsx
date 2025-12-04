"use client";

import Link from "next/link";
import { toast } from "sonner";

import {
  useCurrentAccount,
  useIotaClientContext,
  useSignPersonalMessage,
} from "@iota/dapp-kit";
import { FileSignature, History, RefreshCcw, Send } from "lucide-react";
import { verifyPersonalMessageSignature } from "@iota/iota-sdk/verify";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useTokens from "@/hooks/useTokens";

const createNonce = () =>
  typeof window !== "undefined" && window.crypto?.randomUUID
    ? window.crypto.randomUUID()
    : Math.random().toString(36).slice(2, 10);

const Wallet = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address ?? "";
  const { network } = useIotaClientContext();
  const { tokens, refetch, isFetching } = useTokens({ address });
  const { mutateAsync: signPersonalMessageMutate, isPending: isSigning } =
    useSignPersonalMessage();

  const handleManualRefresh = () => {
    refetch();
  };

  const handleSignNonceChallenge = async () => {
    const nonceChallenge = createNonce();
    const challengeMessage = `LiquidQuest nonce: ${nonceChallenge}`;
    const messageBytes = new TextEncoder().encode(challengeMessage);
    try {
      const result = await signPersonalMessageMutate({
        message: messageBytes,
      });
      const publicKey = await verifyPersonalMessageSignature(
        messageBytes,
        result.signature
      );

      if (publicKey.toIotaAddress() !== address) {
        throw new Error(
          "Signature was valid, but was signed by a different key pair"
        );
      }
      toast.success("Nonce challenge signed successfully!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "sign error");
    }
  };

  return (
    <>
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xl font-semibold text-foreground">Wallet</p>
            <p className="text-sm text-muted-foreground">
              Balances, transfers & actions
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon-sm"
            className="border border-border/50 hover:border-primary/50 hover:cursor-pointer"
            aria-label="Refresh balances"
            onClick={handleManualRefresh}
            disabled={!address}
          >
            <RefreshCcw
              className={`w-4 h-4 ${
                isFetching ? "animate-spin text-primary" : ""
              }`}
            />
          </Button>
        </div>

        <div className="flex flex-col">
          <div className="space-y-2">
            {!address && (
              <div className="rounded-xl border border-dashed border-border/50 bg-muted/10 px-4 py-6 text-center text-sm text-muted-foreground">
                Connect a wallet to load your token balances.
              </div>
            )}

            {address && tokens.length === 0 && (
              <div className="rounded-xl border border-border/40 bg-background/50 px-4 py-6 text-center text-sm text-muted-foreground">
                No tokens found for this account.
              </div>
            )}

            {address && tokens.length > 0 ? (
              <>
                {tokens.map((token) => {
                  const displaySymbol = token.symbol ?? "";
                  const avatarFallback = displaySymbol
                    .slice(0, 2)
                    .toUpperCase();
                  const displayName = token.name ?? displaySymbol;
                  const showBalance = token.balance;
                  return (
                    <div
                      key={token.coinType}
                      className="flex items-center justify-between rounded-xl border border-border/40 bg-background/30 px-4 py-2"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="size-9 border border-border/40 bg-background">
                          {token.iconUrl ? (
                            <AvatarImage
                              src={token.iconUrl}
                              alt={displaySymbol}
                            />
                          ) : null}
                          <AvatarFallback className="text-xs uppercase">
                            {avatarFallback}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-0.5">
                          <p className="text-sm font-semibold text-foreground">
                            {displayName}
                          </p>
                          <p className="text-xs tracking-wide text-muted-foreground">
                            {displaySymbol}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-row gap-4 items-center">
                        <div className="min-w-20 text-right text-sm font-bold text-foreground font-mono">
                          {showBalance ?? (
                            <span className="inline-flex w-full justify-end text-muted-foreground animate-pulse">
                              --
                            </span>
                          )}
                        </div>
                        <Button size="sm" variant="outline">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : null}
          </div>

          {address && (
            <div className="flex flex-wrap gap-3 mt-4">
              <Button
                variant="outline"
                onClick={handleSignNonceChallenge}
                disabled={isSigning}
                className="flex-1 min-w-[180px] justify-center gap-2 py-6 text-base hover:cursor-pointer"
              >
                <FileSignature className="h-5 w-5" />
                Sign
              </Button>

              <Button
                asChild
                variant="outline"
                className="flex-1 min-w-[180px] justify-center gap-2 py-6 text-base"
              >
                <Link
                  href={`https://iotascan.com/${network}/account/${address}`}
                  target="_blank"
                  className="flex w-full items-center justify-center gap-2"
                >
                  <History className="h-5 w-5" />
                  History
                </Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    </>
  );
};

export default Wallet;
