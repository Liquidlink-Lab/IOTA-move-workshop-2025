import { useIotaClientQueries, useIotaClientQuery } from "@iota/dapp-kit";
import { IOTA_DECIMALS, IOTA_TYPE_ARG } from "@iota/iota-sdk/utils";

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
  decimals: number;
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
      const decimals = normalizeDecimals(meta?.decimals, r.coinType);

      const balance = formatBalanceForDisplay(
        formatUnits(r.totalBalance, decimals),
        decimals
      );

      return {
        coinType: r.coinType,
        symbol: meta?.symbol ?? null,
        name: meta?.name ?? "CERT",
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

function normalizeDecimals(
  decimalsRaw: number | string | null | undefined,
  coinType: string
) {
  const parsed =
    decimalsRaw === null || decimalsRaw === undefined
      ? Number.NaN
      : Number(decimalsRaw);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return coinType === IOTA_TYPE_ARG ? IOTA_DECIMALS : 0;
  }
  return parsed;
}

function formatBalanceForDisplay(units: string, decimals: number) {
  if (!units) return null;

  const [intPartRaw, fracPartRaw] = units.split(".");
  const intPart = intPartRaw || "0";
  const fracPart = fracPartRaw?.replace(/0+$/, "") ?? "";

  const intWithSeparators = BigInt(intPart).toLocaleString("en-US");
  if (!fracPart) {
    return intWithSeparators;
  }

  const numeric = Number(units);
  if (Number.isFinite(numeric)) {
    return numeric.toLocaleString("en-US", {
      minimumFractionDigits: Math.min(2, decimals),
      maximumFractionDigits: decimals > 0 ? decimals : 4,
    });
  }

  return `${intWithSeparators}.${fracPart}`;
}

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
