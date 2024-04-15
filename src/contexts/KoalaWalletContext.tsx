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
  koalaWalletConnect: () => Promise<any>;
  koalaSuccessWalletAddress: string;
  koalaAccounts: any[];
}

/**
 * Context
 */
export const ClientContext = createContext<IContext>({} as IContext);

/**
 * Provider
 */
export function KoalaWalletContextProvider({
  children,
}: {
  children: ReactNode | ReactNode[];
}) {
  const [koalaSuccessWalletAddress, setKoalaSuccessWalletAddress] =
    useState<string>("");
  const [koalaAccounts, setKoalaAccounts] = useState<any[]>([]);
  const koalaWalletConnect = async () => {
    console.log("koalaWalletConnect");

    const response = await (window as any).koala.request({
      method: "kda_connect",
      networkId: NETWORKID,
    });
    console.log(response, "response");
    if (response?.status === "success") {
      setKoalaSuccessWalletAddress(response.wallet.account);
      return response;
    } else {
      console.log("error");
    }
  };

  const value = useMemo(
    () => ({
      koalaWalletConnect,
      koalaSuccessWalletAddress,
      koalaAccounts,
    }),
    []
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

export function useKoalaWallletClient() {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error(
      "useKoalaWalletClient must be used within a KoalaContextProvider"
    );
  }
  return context;
}
