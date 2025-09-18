import User from '../models/userModel.js';
import generateToken from "../utils/generateToken.js";
import AppError from '../utils/AppError.js';
import jwt from 'jsonwebtoken';
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
        return next(new AppError("User already exists with connected wallet", 400));
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

    console.log(user);

    return successResponse(res, "User registered successfully", user);
}

const getCurrentUser = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new AppError("Please login to access this resource", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    return successResponse(res, "", user);
}

const logoutUser = async (req, res, next) => {
    res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0
    });
    return successResponse(res, "User logged out successfully");
}

const loginUser = async (req, res, next) => {
    const { name, walletAddress } = req.body;

    if (!walletAddress.trim()) {
        return next(new AppError("Please connect your wallet", 400));
    }

    const user = await User.findOne({ walletAddress });
    if (!user) {
        return next(new AppError("User not found", 404));
    }

    const token = generateToken(user._id);
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return successResponse(res, "User logged in successfully", user);
}

export {
    registerUser,
    getCurrentUser,
    logoutUser,
    loginUser,
}