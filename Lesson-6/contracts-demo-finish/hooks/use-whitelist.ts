import { useIotaClientQuery } from "@iota/dapp-kit";
import {
  IotaObjectResponse,
  MoveStruct,
  MoveValue,
} from "@iota/iota-sdk/client";

const WHITELIST_OBJECT_ID =
  "0xce38d813e9694dd9a00f6c825408379811f9182949335ac5ea90958645c7d96e";

export type WhitelistEntry = {
  address: string;
  name: string;
};

export type WhitelistState = {
  id: string | null;
  admin: string | null;
  state: boolean | null;
  allowed: WhitelistEntry[];
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

const parseAllowedEntries = (
  rawAllowed: MoveValue | undefined
): WhitelistEntry[] => {
  const allowedFields = getStructFields(rawAllowed as MoveStruct | undefined);
  const contents = allowedFields?.contents;

  if (!Array.isArray(contents)) return [];

  return contents.map((entry) => {
    const fields = getStructFields(entry as MoveStruct | undefined);
    const address = fields?.key as string;
    const name = fields?.value as string;

    return {
      address,
      name,
    };
  });
};

const parseWhitelistResponse = (
  response: IotaObjectResponse | undefined
): WhitelistState => {
  if (
    !response?.data?.content ||
    response.data.content.dataType !== "moveObject"
  ) {
    return {
      id: WHITELIST_OBJECT_ID,
      admin: "",
      state: false,
      allowed: [],
    };
  }

  const fields = getStructFields(response.data.content);
  const admin = typeof fields?.admin === "string" ? fields.admin : null;
  const state = typeof fields?.state === "boolean" ? fields.state : null;
  const allowed = parseAllowedEntries(fields?.allowed);

  return {
    id: WHITELIST_OBJECT_ID,
    admin,
    state,
    allowed,
  };
};

export const useWhitelist = () => {
  const { data, isRefetching, isPending, refetch } = useIotaClientQuery(
    "getObject",
    {
      id: WHITELIST_OBJECT_ID,
      options: {
        showContent: true,
      },
    },
    {
      queryKey: ["whitelist"],
      select: (data) => parseWhitelistResponse(data),
    }
  );

  return { data, isLoading: isPending || isRefetching, refetch };
};
