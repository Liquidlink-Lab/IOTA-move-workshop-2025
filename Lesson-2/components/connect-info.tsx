"use client";

import {
  ConnectModal,
  useCurrentAccount,
  useDisconnectWallet,
} from "@iota/dapp-kit";
import { Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";

const ConnectInfo = () => {
  const currentAccount = useCurrentAccount();
  const { mutate: disconnect, isPending: isDisconnecting } =
    useDisconnectWallet();

  if (!currentAccount?.address) {
    return (
      <ConnectModal
        trigger={
          <Button className="bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-opacity">
            <Wallet className="w-4 h-4 mr-2" />
            Connect Wallet
          </Button>
        }
      />
    );
  }

  const { address } = currentAccount;
  const truncatedAddress =
    address.length > 12
      ? `${address.slice(0, 6)}...${address.slice(-4)}`
      : address;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border px-4 py-2 bg-background/80">
      <div className="flex items-center gap-3">
        <Wallet className="w-4 h-4 text-primary" />
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">
            Connected wallet
          </span>
          <span className="font-mono text-sm font-medium">
            {truncatedAddress}
          </span>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="ml-auto"
        disabled={isDisconnecting}
        onClick={() => disconnect()}
      >
        {isDisconnecting ? "Disconnecting..." : "Disconnect"}
      </Button>
    </div>
  );
};

export default ConnectInfo;
