import BankABI from "../abis/Bank.json";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";

const BANK_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const getBank = async (provider: ethers.BrowserProvider) => {
  if (!provider) {
    console.log("No provider found");
    return;
  }

  const signer = await provider.getSigner();
  const bank = new ethers.Contract(BANK_CONTRACT_ADDRESS, BankABI.abi, signer);
  return { bank };
};

export const useBank = () => {
  const { account, provider } = useWallet();

  const depositToken = async (token: string) => {
    try {
      const bankObj = await getBank(provider);
      if (!bankObj) return;
      const { bank } = bankObj;

      const tx = await bank.deposit({
        value: ethers.parseEther(token),
      });
      const receipt = await tx.wait();
      return {
        success: true,
        receipt,
      };
    } catch (error: any) {
      console.log("Error in deposit: ", error);
      return {
        success: false,
        error:
          error?.reason === "rejected"
            ? "Transaction Rejected"
            : "Transaction Failed",
      };
    }
  };

  const withdraw = async (token: string) => {
    try {
      const bankObj = await getBank(provider);
      if (!bankObj) return;
      const { bank } = bankObj;

      const tx = await bank.withdraw(ethers.parseEther(token));
      const receipt = await tx.wait();
      return {
        success: true,
        receipt,
      };
    } catch (error: any) {
      console.log("Error in withdraw:", error);
      return {
        success: false,
        error:
          error?.reason === "rejected"
            ? "Transaction Rejected"
            : "Transaction Failed",
      };
    }
  };

  const getBalance = async () => {
    try {
      const bankObj = await getBank(provider);
      if (!bankObj) return;
      const { bank } = bankObj;

      const balance = await bank.getBalance(account);
      return ethers.formatEther(balance);
    } catch (error) {
      console.log("Error in getBalance:", error);
    }
  };

  return { depositToken, getBalance, withdraw };
};
