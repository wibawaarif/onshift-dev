import mongoose, { Schema } from 'mongoose';

const teamSchema = new Schema({
    name: {
        type: String,
    },
    user: {
        type: String,
        required: true,
    },
}, { timestamps: true })

export default mongoose?.models?.Team || mongoose.model("Team", teamSchema)

