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
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    radius: {
      type: Number,
    },
    user: {
      type: String,
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Location || mongoose.model("Location", locationSchema)

