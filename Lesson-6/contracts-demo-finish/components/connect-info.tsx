"use client";

import { useState } from "react";

import {
  ConnectModal,
  useCurrentAccount,
  useCurrentWallet,
  useDisconnectWallet,
  useIotaClientContext,
} from "@iota/dapp-kit";
import { Wallet, Copy, Check, LogOut, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const ConnectInfo = () => {
  const currentAccount = useCurrentAccount();
  const { currentWallet, isConnected } = useCurrentWallet();
  const { network, selectNetwork } = useIotaClientContext();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectWallet();
  const [isCopied, setIsCopied] = useState(false);

  const address = currentAccount?.address ?? "";
  const truncatedAddress =
    address.length > 12
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;

  const handleCopyAddress = async () => {
    if (!address) return;
    await navigator.clipboard.writeText(address);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 1500);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-2 bg-background/80">
      {isConnected && (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentWallet?.icon} />
          </Avatar>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">
              Connected wallet
            </span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-medium">
                {truncatedAddress}
              </span>
              {address ? (
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleCopyAddress}
                  className="h-7 w-7 border border-transparent hover:border-border/70 hover:cursor-pointer"
                  aria-label="Copy address"
                >
                  {isCopied ? (
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="relative flex items-center flex-1 min-w-[100px] max-w-xs">
        <Select value={network} onValueChange={(v) => selectNetwork(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="localnet" value="localnet">
              localnet
            </SelectItem>
            <SelectItem key="mainnet" value="mainnet">
              mainnet
            </SelectItem>
            <SelectItem key="testnet" value="testnet">
              testnet
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto">
        {isConnected ? (
          <Button
            variant="outline"
            size="icon-sm"
            disabled={isDisconnecting}
            onClick={() => disconnect()}
            aria-label="Disconnect wallet"
            className="hover:cursor-pointer"
          >
            {isDisconnecting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <ConnectModal
            trigger={
              <Button className="bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-opacity hover:cursor-pointer">
                <Wallet className="w-4 h-4 mr-2" />
                Connect Wallet
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default ConnectInfo;
