import SignClient from "@walletconnect/sign-client";
import { WalletConnectModal } from "@walletconnect/modal";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import type { SessionTypes } from "@walletconnect/types";

const projectId = "104ce761ed46b94e3327f282c15dfd0c";

export const useWalletConnect = () => {
  const [client, setClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [account, setAccount] = useState<string | null>(null);

  // Initialize the SignClient
  useEffect(() => {
    const initClient = async () => {
      try {
        const signClient = await SignClient.init({
          projectId,
          relayUrl: "wss://relay.walletconnect.com",
        });

        setClient(signClient);
      } catch (error) {
        console.log("SignClient initialization error: ", error);
      }
    };
    initClient();
  }, []);

  const connectWallet = async () => {
    if (!client) return;

    try {
      // Client connection
      const { uri, approval } = await client.connect({
        requiredNamespaces: {
          eip155: {
            chains: ["eip155:1"],
            methods: [
              "eth_signTransaction",
              "personal_sign",
              "eth_signTypedData",
            ],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });

      const modal = new WalletConnectModal({
        projectId,
      });

      // Show QR if needed
      if (uri) {
        await modal.openModal({ uri });
      }

      // Wait for user to approve the connection
      const session = await approval();
      modal.closeModal();

      const userAccount = session.namespaces.eip155.accounts[0].split(":")[2];
      setSession(session);
      setAccount(userAccount);

      // Create ethers provider using the connected wallet
      const wcProvider = new ethers.BrowserProvider({
        request: (args: any) =>
          client.request({
            topic: session.topic,
            chainId: "eip155:1",
            request: args,
          }),
      } as any);

      setProvider(wcProvider);

      client.on("session_event", ({ params: { event, chainId } }) => {
        if (event.name === "accountsChanged") {
          const accounts: string[] = event.data;
          setAccount(accounts[0].split(":")[2]);
        }

        if (event.name === "chainChanged") {
          console.log("Chain changed:", chainId, event.data);
        }
      });
    } catch (error) {
      console.log("WalletConnect connection error: ", error);
    }
  };
  
  return { client, session, provider, account, connectWallet };
};
