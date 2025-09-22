import { ethers } from 'ethers';
import { createRequire } from "module";
import Event from '../models/eventModel.js';
import User from '../models/userModel.js';

const require = createRequire(import.meta.url);
const bankABI = require("../abis/BankABI.json");

export const startBankListeners = async () => {
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const bank = new ethers.Contract(process.env.BANK_CONTRACT_ADDRESS, bankABI.abi, provider);

    // Clear old listeners
    bank.removeAllListeners();

    const startBlock = await provider.getBlockNumber();

    // Common handler for Deposit & Withdraw
    const handleEvent = async (type, from, amount, payload, balanceUpdates) => {
        const { transactionHash, blockNumber } = payload.log;
        console.log("Inside handleEvent");

        // Skip old events
        if (blockNumber <= startBlock) return;

        try {
            const tokens = Number(ethers.formatEther(amount));

            // Save event in DB
            await Event.create({
                eventType: type,
                from,
                amountEth: tokens,
                amountWei: amount.toString(),
                txHash: transactionHash,
                blockNumber
            });

            // Update user balance
            const user = await User.findOneAndUpdate(
                { walletAddress: from.toLowerCase() },
                { $inc: balanceUpdates(tokens) },
                { new: true }
            );

            console.log("Token: ", tokens);
            console.log(`${type} Success → Tx: ${transactionHash} Block: ${blockNumber}`);
            console.log("User updated:", user);
        } catch (error) {
            console.error(`Error saving ${type}:`, error.message);
        }
    };

    // Deposit event
    bank.on("Deposit", (from, amount, payload) =>
        handleEvent("Deposit", from, amount, payload, tokens => ({
            bankTokens: -tokens,
            depositedTokens: tokens
        }))
    );

    // Withdraw event
    bank.on("Withdraw", (from, amount, payload) =>
        handleEvent("Withdraw", from, amount, payload, tokens => ({
            bankTokens: tokens,
            depositedTokens: -tokens
        }))
    );

    // Transfer event (basic logging for now)
    bank.on("Transfer", (from, to, amount, payload) => {
        console.log("Transfer Event:", {
            from,
            to,
            amount: amount.toString(),
            txHash: payload.log.transactionHash,
            block: payload.log.blockNumber
        });
    });
};