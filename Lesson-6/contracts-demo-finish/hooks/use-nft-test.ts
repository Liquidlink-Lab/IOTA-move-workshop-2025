import { useIotaClient, useSignAndExecuteTransaction } from "@iota/dapp-kit";
import { Transaction } from "@iota/iota-sdk/transactions";

const NFT_TEST_PACKAGE_ID =
  "0x7a3dc160244e5cf76e61e39a61935063592f3d661e6190c6927634f99c15108d"; 

export const useNftTest = () => {
  const client = useIotaClient();
  const { mutateAsync: signAndExecuteTransaction, isPending } =
    useSignAndExecuteTransaction();

  const mintNFT = async ({
    onSuccess,
    onError,
  }: {
    onSuccess?: (digest: string) => void;
    onError?: (error: unknown) => void;
  }) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${NFT_TEST_PACKAGE_ID}::testnft::mint_to_sender`,
      arguments: [
        tx.pure.vector("u8", Array.from(new TextEncoder().encode("My NFT"))),
        tx.pure.vector(
          "u8",
          Array.from(new TextEncoder().encode("This is my first NFT"))
        ),
        tx.pure.vector(
          "u8",
          Array.from(
            new TextEncoder().encode(
              "https://iota.liquidlink.io/avatars/nft.png"
            )
          )
        ),
      ],
    });

    try {
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });
      onSuccess?.(result.digest);
    } catch (error) {
      onError?.(error);
      throw error;
    }
  };

  const burnNFT = async ({
    nftId,
    onSuccess,
    onError,
  }: {
    nftId: string;
    onSuccess?: (digest: string) => void;
    onError?: (error: unknown) => void;
  }) => {
    const tx = new Transaction();
    tx.moveCall({
      target: `${NFT_TEST_PACKAGE_ID}::testnft::burn`,
      arguments: [tx.object(nftId)],
    });

    try {
      const result = await signAndExecuteTransaction({
        transaction: tx,
      });

      await client.waitForTransaction({ digest: result.digest });
      onSuccess?.(result.digest);
    } catch (error) {
      onError?.(error);
      throw error;
    }
  };

  return { mintNFT, burnNFT, isLoading: isPending };
};
