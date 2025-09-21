import { ethers } from 'ethers';
import { createRequire } from "module";
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';

const require = createRequire(import.meta.url);
const bankABI = require("../abis/BankABI.json");

export const startBankListeners = async () => {

    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const bank = new ethers.Contract(process.env.BANK_CONTRACT_ADDRESS, bankABI.abi, provider);

    bank.removeAllListeners();
    const currentBlockNumber = await provider.getBlockNumber();

    bank.on("Deposit", async (from, amount, log) => {
        console.log("Deposit Event: ", from, amount.toString());
        if (log.log.blockNumber <= currentBlockNumber) {
            return;
        }
        try {
            const tokens = Number(ethers.formatEther(amount));

            await Event.create({
                eventType: "Deposit",
                from,
                amountEth: tokens,
                amountWei: amount.toString(),
                txHash: log.log.transactionHash,
                blockNumber: log.log.blockNumber
            });

            const user = await User.findOneAndUpdate(
                { walletAddress: from.toLowerCase() },
                {
                    $inc: {
                        bankTokens: -tokens,
                        depositedTokens: tokens,
                    },
                },
                { new: true }
            );
            console.log("User updated successfully: ", user);
        } catch (error) {
            console.log("Error saving deposit: ", error.message);
        }
    });

    bank.on("Withdraw", async (from, amount, log) => {
        console.log("Withdraw Event: ", from, amount);
        if (log.log.blockNumber <= currentBlockNumber) {
            return;
        }
        try {
            const tokens = Number(ethers.formatEther(amount));

            await Event.create({
                eventType: "Withdraw",
                from,
                amountEth: tokens,
                amountWei: amount.toString(),
                txHash: log.log.transactionHash,
                blockNumber: log.log.blockNumber
            });

            const user = await User.findOneAndUpdate(
                { walletAddress: from.toLowerCase() },
                {
                    $inc: {
                        bankTokens: tokens,
                        depositedTokens: -tokens,
                    },
                },
                { new: true }
            );
            console.log("User updated successfully: ", user);
        } catch (error) {
            console.log("Error saving withdraw: ", error.message);
        }
    });

    bank.on("Transfer", (from, to, amount) => {
        console.log("Transfer Event: ", from, to, amount);
    });
}