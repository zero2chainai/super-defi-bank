import { ethers } from "ethers";

export const useEthereum = async () => {
    let provider = null, account = null;

    if (window.ethereum) {
        try {
            provider = new ethers.BrowserProvider(window.ethereum);
            if (provider) {
                const accounts = await provider.send("eth_requestAccounts", []);
                if (accounts?.length > 0) {
                    account = accounts[0];
                }
            } else {
                console.log("No ethereum provider found");
            }
        } catch (error) {
            console.log("Ethereum Error: ", error);
        }
    }
    return { provider, account };
}