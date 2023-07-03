import mongoose, { Schema } from 'mongoose';

const locationSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    }
}, { timestamps: true })

export default mongoose?.models?.Location || mongoose.model("Location", locationSchema)

