"use client";

import "@iota/dapp-kit/dist/index.css";

import { darkTheme, IotaClientProvider, WalletProvider } from "@iota/dapp-kit";
import { getFullnodeUrl } from "@iota/iota-sdk/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";

const networks = {
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
};
const queryClient = new QueryClient();

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider
        networks={networks}
        defaultNetwork="mainnet"
        onNetworkChange={(n) => toast.success(`Switched to ${n}`)}
      >
        <WalletProvider theme={darkTheme} autoConnect>
          {children}
        </WalletProvider>
      </IotaClientProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Providers;
