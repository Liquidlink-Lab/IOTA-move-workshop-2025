"use client";

import { useMemo, useState } from "react";

import {
  Check,
  Copy,
  RefreshCcw,
  Users,
  X,
} from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useWhitelist } from "@/hooks/use-whitelist";

const formatAddress = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const Whitelist = () => {
  const { data: whitelist, isLoading, refetch } = useWhitelist();
  const [searchTerm, setSearchTerm] = useState("");
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const whitelistData =
    whitelist ?? { id: null, admin: null, state: null, allowed: [] };

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const filteredAllowed = useMemo(
    () =>
      whitelistData.allowed.filter((entry) => {
        if (!normalizedSearch) return true;
        const nameMatch = entry.name?.toLowerCase().includes(normalizedSearch);
        const addressMatch = entry.address
          .toLowerCase()
          .includes(normalizedSearch);
        return Boolean(nameMatch || addressMatch);
      }),
    [whitelistData.allowed, normalizedSearch]
  );
  const hasSearch = normalizedSearch.length > 0;
  const handleCopyAddress = async (address: string) => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(address);
      setTimeout(() => setCopiedAddress(null), 1200);
    } catch (err) {
      console.error("Failed to copy address", err);
    }
  };

  const allowedCount = whitelistData.allowed.length;

  return (
    <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all hover:scale-105">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-semibold text-foreground">
            Lesson 1: Whitelist
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="border border-border/50 hover:border-primary/50 hover:cursor-pointer"
            aria-label="Refresh whitelist"
            disabled={isLoading}
            onClick={() => refetch()}
          >
            <RefreshCcw
              className={`h-4 w-4 ${
                isLoading ? "animate-spin text-primary" : ""
              }`}
            />
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-border/40 overflow-hidden bg-background/40">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Allowed</span>
          </div>
          <span className="text-xs text-muted-foreground">
            {allowedCount} addresses
          </span>
        </div>

        <div className="border-t border-border/30">
          {isLoading ? (
            <div className="space-y-2 p-4">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="h-10 rounded-lg bg-muted/40 animate-pulse"
                />
              ))}
            </div>
          ) : whitelistData.allowed.length === 0 ? (
            <div className="p-4 text-xs text-muted-foreground">
              尚未有地址被加入 whitelist。
            </div>
          ) : (
            <>
              <div className="px-4 py-3 border-b border-border/30 bg-background/30">
                <label
                  htmlFor="whitelist-search"
                  className="text-xs text-muted-foreground"
                >
                  搜尋地址或名稱
                </label>
                <div className="relative mt-2">
                  <input
                    id="whitelist-search"
                    type="text"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="輸入地址或別名"
                    className="w-full rounded-lg border border-border/40 bg-background px-3 py-2 pr-10 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isLoading}
                  />
                  {searchTerm ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-1.5 top-1/2 -translate-y-1/2"
                      aria-label="清除搜尋"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  ) : null}
                </div>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  {hasSearch
                    ? `顯示符合「${searchTerm}」的地址`
                    : "可用地址或名稱快速篩選。"}
                </p>
              </div>

              <ScrollArea type="always" className="h-72">
                <div className="divide-y divide-border/30">
                  {filteredAllowed.length === 0 ? (
                    <div className="p-4 text-xs text-muted-foreground">
                      沒有符合搜尋的地址。
                    </div>
                  ) : (
                    filteredAllowed.map((entry) => (
                      <div
                        key={entry.address}
                        className="px-4 py-3 flex items-start justify-between gap-3"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-foreground">
                            {entry.name ?? "(未命名)"}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono text-muted-foreground">
                              {hasSearch
                                ? entry.address
                                : formatAddress(entry.address)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              className="h-7 w-7 border border-transparent hover:border-border/70"
                              aria-label="複製地址"
                              onClick={() => handleCopyAddress(entry.address)}
                            >
                              {copiedAddress === entry.address ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default Whitelist;
