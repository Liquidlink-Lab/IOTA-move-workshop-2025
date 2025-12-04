import { useIotaClientQueries, useIotaClientQuery } from "@iota/dapp-kit";

type CoinRow = {
  coinType: string;
  totalBalance: string; // stringified bigint
};

type TokenInfo = {
  coinType: string;
  symbol: string | null;
  name: string | null;
  iconUrl: string | null;
  balance: string | null;
  decimals: number | null;
  isMetadataLoading: boolean;
};

const useTokens = ({ address }: { address: string }) => {
  const {
    data: balancesData,
    refetch,
    isFetching,
  } = useIotaClientQuery(
    "getAllBalances",
    { owner: address },
    { refetchInterval: 15000, enabled: !!address }
  );

  const rows: CoinRow[] = (balancesData ?? []).map((b) => ({
    coinType: b.coinType,
    totalBalance: b.totalBalance,
  }));

  const metaQueries = useIotaClientQueries({
    queries: rows.map((r) => ({
      method: "getCoinMetadata",
      params: { coinType: r.coinType },
      options: {
        queryKey: ["coinMeta", r.coinType],
        staleTime: 60 * 60 * 1000, // one hour
      },
    })),
  });

  const tokens: TokenInfo[] = rows
    .map((r, i) => {
      const metaQuery = metaQueries[i];
      const meta = metaQuery?.data ?? null;
      const decimalsRaw = meta?.decimals;
      const decimals =
        decimalsRaw === null || decimalsRaw === undefined
          ? null
          : Number(decimalsRaw);

      const balance =
        decimals === null
          ? null
          : Number(formatUnits(r.totalBalance, decimals)).toLocaleString(
              "en-US",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: decimals > 0 ? decimals : 4,
              }
            );

      return {
        coinType: r.coinType,
        symbol: meta?.symbol ?? null,
        name: meta?.name ?? null,
        iconUrl: meta?.iconUrl ?? null,
        balance,
        decimals,
        isMetadataLoading: metaQuery?.isPending ?? false,
      };
    })
    .sort((a, b) => (a.symbol ?? "").localeCompare(b.symbol ?? ""));

  const isMetaLoading = metaQueries.some((query) => query?.isPending);

  return { tokens, refetch, isFetching: isFetching || isMetaLoading };
};

export default useTokens;

function formatUnits(amount: string, decimals: number) {
  if (amount === "0") return "0";
  if (decimals === 0) {
    return BigInt(amount).toString();
  }

  const padded = amount.padStart(decimals + 1, "0");
  const intPart = padded.slice(0, -decimals) || "0";
  const fracPart = padded.slice(-decimals).replace(/0+$/, "");

  return fracPart ? `${intPart}.${fracPart}` : intPart;
}
