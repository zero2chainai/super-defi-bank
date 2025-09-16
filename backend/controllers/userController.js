import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";
import AppError from '../utils/AppError.js';
import { successResponse } from '../utils/response.js';

const registerUser = async (req, res, next) => {
    const { name, walletAddress } = req.body;

    if (!name.trim()) {
        return next(new AppError("Please fill in all the fields", 400));
    }

    if (!walletAddress.trim()) {
        return next(new AppError("Please connect your wallet", 400));
    }

    const existingUer = await User.findOne({ walletAddress });
    if (existingUer) {
        return next(new AppError("User already exists", 400));
    }

    const user = await User.create({
        name,
        walletAddress
    });
    if (!user) {
        return next(new AppError("User registration failed", 500));
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, 200, "User registered successfully", user);
}

export {
    registerUser
}