import { successResponse } from "../utils/successResponse.js";
import User from '../models/userModel.js';
import { errorResponse } from "../utils/errorResponse.js";
import generateToken from "../utils/generateToken.js";

const registerUser = async (req, res) => {
    const { name, walletAddress } = req.body;

    if (!name.trim()) {
        return errorResponse(res, 400, "Please fill all the required fields");
    }

    if (!walletAddress.trim()) {
        return errorResponse(res, 400, "Please connect your wallet");
    }

    const existingUer = await User.findOne({ walletAddress });
    if (existingUer) {
        return res.status(400).json({
            success: false,
            message: "User already exists"
        });
    }

    try {
        const user = await User.create({
            name,
            walletAddress
        });
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User registration failed"
            });
        }

        const token = generateToken(user._id);
        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return successResponse(res, 200, "User registered successfully", user);
    } catch (error) {
        return errorResponse(res, 500, "User registration failed", error);
    }
}

export {
    registerUser
}