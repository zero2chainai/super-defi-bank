import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    walletAddress: {
        type: String,
        required: true
    },
    bankTokens: {
        type: Number,
        default: 10
    },
    depositedTokens: {
        type: Number
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;