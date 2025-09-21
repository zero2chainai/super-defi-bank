import EthereumProvider from "@walletconnect/ethereum-provider";
import { ethers } from "ethers";

const PROJECT_ID = "104ce761ed46b94e3327f282c15dfd0c";
const SUPPORTED_CHAIN = 31337;

export const useWalletConnect = async () => {
  let provider: ethers.BrowserProvider | null = null,
    account: string | null = null,
    wcProvider: any = null;

  try {
    const ethProvider = await EthereumProvider.init({
      projectId: PROJECT_ID,
      chains: [SUPPORTED_CHAIN],
      optionalChains: [],
      rpcMap: {
        [SUPPORTED_CHAIN]: "https://dayton-flex-owns-activities.trycloudflare.com"
      },
      showQrModal: true,
      methods: [
        "eth_sendTransaction",
        "personal_sign",
        "eth_signTypedData",
        "eth_signTransaction",
      ],
      events: ["chainChanged", "accountsChanged"],
    });

    if (ethProvider) {
      wcProvider = ethProvider;

      ethProvider.on("accountsChanged", (accounts: string[]) => {
        if (accounts?.length > 0) {
          account = accounts[0];
        }
      });

      ethProvider.on("session_update", (event: any) => {
        console.log("WalletConnect session update:", event);
      });

      ethProvider.on("chainChanged", async (chainId: string) => {
        console.log("Chain changed: ", chainId);
        provider = new ethers.BrowserProvider(ethProvider);
      });

      const accounts = await ethProvider.enable();
      if (accounts?.length > 0) {
        account = accounts[0];
        provider = new ethers.BrowserProvider(ethProvider);
      }
    } else {
      console.log("No walletconnect provider found");
    }
  } catch (error) {
    console.log("WalletConnect Error: ", error);
  }

  return { provider, account, wcProvider };
};
