import { OBJECT_HERO } from "@/consts";
import {
  useCurrentAccount,
  useIotaClientContext,
  useIotaClientQuery,
} from "@iota/dapp-kit";
import {
  IotaObjectResponse,
  MoveStruct,
  MoveValue,
} from "@iota/iota-sdk/client";

const HERO_DECIMALS = 1_000_000_000;
const AVATARS = ["🦸", "🛡️", "⚔️", "🐉", "🧙", "🦾", "🛰️", "🧝"];

type LeaderboardEntry = {
  rank: number;
  address: string;
  points: number;
  avatar: string;
  isYou: boolean;
};

type LeaderboardState = {
  id: string;
  ranking: LeaderboardEntry[];
};

const getStructFields = (
  value: MoveStruct | null | undefined
): Record<string, MoveValue> | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  if ("fields" in value && value.fields) {
    return value.fields as Record<string, MoveValue>;
  }

  return value as Record<string, MoveValue>;
};

const emojiForAddress = (address: string) => {
  if (!address) return "❓";
  const hash = address
    .split("")
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 0);
  return AVATARS[hash % AVATARS.length] ?? AVATARS[0];
};

const parseRankingEntries = (
  rawRanking: MoveValue | undefined,
  currentAddress: string
): LeaderboardEntry[] => {
  const rankingFields = getStructFields(rawRanking as MoveStruct | undefined);
  const contents = rankingFields?.contents;

  if (!Array.isArray(contents)) return [];

  const parsedEntries = contents.reduce<LeaderboardEntry[]>((list, entry) => {
    const fields = getStructFields(entry as MoveStruct | undefined);
    const address = fields?.key as string;
    const points = Number(fields?.value) / HERO_DECIMALS;

    list.push({
      rank: 0,
      address,
      points,
      avatar: emojiForAddress(address),
      isYou: address === currentAddress,
    });
    return list;
  }, []);

  return parsedEntries
    .sort((a, b) => b.points - a.points)
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
};

const parseLeaderboardResponse = (
  response: IotaObjectResponse | undefined,
  currentAddress: string
): LeaderboardState => {
  const objectId = response?.data?.objectId ?? "";
  if (
    !response?.data?.content ||
    response.data.content.dataType !== "moveObject"
  ) {
    return {
      id: objectId,
      ranking: [],
    };
  }

  const fields = getStructFields(response.data.content);
  const ranking = parseRankingEntries(fields?.ranking, currentAddress);

  return {
    id: objectId,
    ranking,
  };
};

export const useLeaderboard = () => {
  const { network } = useIotaClientContext();
  const currentAccount = useCurrentAccount();
  const currentAddress = currentAccount?.address ?? "";
  const { data, isPending, isRefetching, refetch } = useIotaClientQuery(
    "getObject",
    {
      id: OBJECT_HERO[network].fightList ?? "",
      options: {
        showContent: true,
      },
    },
    {
      queryKey: ["leaderboard"],
      staleTime: 15_000,
      select: (data) => parseLeaderboardResponse(data, currentAddress),
    }
  );

  return { data, isLoading: isPending || isRefetching, refetch };
};
