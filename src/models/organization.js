import mongoose, { Schema } from 'mongoose';

const organizationSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Organization || mongoose.model("Organization", organizationSchema)

