import mongoose, { Schema } from 'mongoose';

const locationSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    address: {
      type: String,
    },
    user: {
      type: String,
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Location || mongoose.model("Location", locationSchema)

