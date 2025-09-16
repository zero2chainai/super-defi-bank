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
    balance: {
        type: String,
        default: "1000"
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;