"use client";

import { ThemeProvider } from "next-themes";
import { ClientContextProvider } from "@/contexts/WalletConnectContext";
import { AccountProvider } from "@/contexts/AccountContext";
import { EckoWalletContextProvider } from "@/contexts/EckoWalletContext";
import { KoalaWalletContextProvider } from "@/contexts/KoalaWalletContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClientContextProvider>
      <EckoWalletContextProvider>
        <KoalaWalletContextProvider>
          <AccountProvider>
            <ThemeProvider
              attribute="class"
              enableSystem={false}
              defaultTheme="light"
            >
              {children}
            </ThemeProvider>
          </AccountProvider>
        </KoalaWalletContextProvider>
      </EckoWalletContextProvider>
    </ClientContextProvider>
  );
}
