import BankABI from "../abis/Bank.json";
import { ethers } from "ethers";
import { useWallet } from "../contexts/WalletContext";

const BANK_CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const useBank = () => {
  const { account, provider } = useWallet();

  const getSigner = async () => {
    if (!provider) {
      console.log("No provider found");
      return;
    }
    return provider.getSigner();
  };

  const depositToken = async (token: string) => {
    try {
      const signer = await getSigner();
      const bank = new ethers.Contract(
        BANK_CONTRACT_ADDRESS,
        BankABI.abi,
        signer
      );

      console.log("Signer: ", signer);
      console.log("Bank: ", bank);
      console.log("Bank ABI:", BankABI.abi);
      console.log("Token: ", typeof token, token);
      const provider = signer.provider;
      const net = await provider.getNetwork();
      console.log("Connected chainId:", net.chainId.toString());
      console.log("Connected Name:", net.name);
      console.log("Expected contract chainId: 31337 (Hardhat localhost?)");

      const tx = await bank.deposit({
        value: ethers.parseEther(token),
      });
      console.log("Transaction: ", tx);
      return tx.wait();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const getBalance = async () => {
    try {
      const signer = await getSigner();
      const bank = new ethers.Contract(
        BANK_CONTRACT_ADDRESS,
        BankABI.abi,
        signer
      );
      const code = await signer.provider.getCode(BANK_CONTRACT_ADDRESS);
      console.log("Deployed bytecode at address:", code);
      console.log("Address: ", account);
      const tx = await bank.getBalance(account);
      console.log("Transaction: ", tx);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return { depositToken, getBalance };
};
