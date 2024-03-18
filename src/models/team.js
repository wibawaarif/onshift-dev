import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema({
    name: {
        type: String,
    },
    position:
    {
        type: mongoose.Types.ObjectId,
        ref: "Position",
    },
    user: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose?.models?.Team || mongoose.model("Team", teamSchema)

