import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { ethers } from "ethers";
import { useUser } from "../hooks/useUser";
import { useEthereum } from "../hooks/useEthereum";
import { useWalletConnect } from "../hooks/useWalletConnect";

export const WalletContext = createContext<any>(null);

export const WalletProvider = ({ children }: { children: React.ReactNode }) => {
  const [wcProvider, setWcProvider] = useState<any>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const { isLoggedIn, loading } = useUser();

  useEffect(() => {
    if (provider) {
      provider.getNetwork().then((net) => {
        console.log("Connected chainId:", net.chainId.toString());
        console.log("Connected Name:", net.name);
      });
    }
  }, [provider, account]);

  useEffect(() => {
    if (loading) return;

    const restoreSession = async () => {
      try {
        if (window.ethereum) {
          const { provider, account } = await useEthereum();
          setProvider(provider);
          setAccount(account);
          return;
        }
        const { wcProvider, provider, account } = await useWalletConnect();
        setWcProvider(wcProvider);
        setProvider(provider);
        setAccount(account);
      } catch (err) {
        console.error("Error restoring session:", err);
      }
    };

    if (isLoggedIn) {
      restoreSession();
    }
  }, [loading, isLoggedIn]);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const { provider, account } = await useEthereum();
        setProvider(provider);
        setAccount(account);
      } else {
        const { provider, account, wcProvider } = await useWalletConnect();
        setWcProvider(wcProvider);
        setProvider(provider);
        setAccount(account);
      }
    } catch (err) {
      console.error("WalletConnect connection error:", err);
    }
  };

  const disconnectWallet = async () => {
    if (wcProvider) {
      await wcProvider.disconnect();
      console.log("Wallet Disconnected");
      if (wcProvider.session) {
        await wcProvider.cleanup();
      }
      localStorage.removeItem("wc@2:client:0.3//session");
      localStorage.removeItem("wc@2:core:0.3//pairing");
      indexedDB.deleteDatabase("walletconnect");
      localStorage.clear();
      setWcProvider(null);
      setProvider(null);
      setAccount(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{ account, connectWallet, provider, disconnectWallet }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
