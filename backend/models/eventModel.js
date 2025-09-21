import mongoose from 'mongoose';

const eventSchema = mongoose.Schema({
    eventType: {
        type: String,
        required: true
    },
    from: { 
        type: String
    }, 
    to: {
        type: String
    },
    amountEth: {
        type: String,
        required: true
    },
    amountWei: {
        type: String,
        require: true
    },
    txHash: {
        type: String,
        required: true,
        unique: true
    },
    blockNumber: {
        type: Number
    }
}, { timestamps: true });

const Event = mongoose.model("Event", eventSchema);
export default Event;