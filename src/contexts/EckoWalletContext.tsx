"use client";

import { NETWORKID } from "@/constants/contextConstants";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

/**
 * Types
 */
interface IContext {
  eckoWalletConnect: () => Promise<any>;
  eckoSuccessWalletAddress: string;
  eckoAccounts: any[];
}

/**
 * Context
 */
export const ClientContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function EckoWalletContextProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [eckoSuccessWalletAddress, setEckoSuccessWalletAddress] =
    useState<string>("");
  const [eckoAccounts, setEckoAccounts] = useState<any[]>([]);
  const eckoWalletConnect = async () => {
    console.log("eckoWalletConnect");
    const checkNetwork = await (window as any).kadena.request({
      method: "kda_getNetwork",
    });
    if (checkNetwork?.name === "Testnet" || checkNetwork?.name === "Mainnet") {
      const response = await (window as any).kadena.request({
        method: "kda_connect",
        networkId: NETWORKID,
      });
      console.log(response, "response");
      if (response?.status === "success") {
        const account = await (window as any).kadena.request({
          method: "kda_checkStatus",
          networkId: NETWORKID,
        });
        console.log(account, "account");
        if (account?.status === "success") {
          setEckoSuccessWalletAddress(response.account.account);
          return response;
        }
      } else {
      }
    }
  };

  const value = useMemo(
    () => ({
      eckoWalletConnect,
      eckoSuccessWalletAddress,
      eckoAccounts,
    }),
    [],
  );

  return (
    <ClientContext.Provider
      value={{
        ...value,
      }}
    >
      {children}
    </ClientContext.Provider>
  );
}

export function useEckoWallletClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      "useEckoWalletClient must be used within a EckoContextProvider",
    );
  }
  return context;
}
