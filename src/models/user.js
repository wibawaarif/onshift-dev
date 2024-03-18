import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
  },
  password: {
    type: String,
  },
  businessName: {
    type: String,
  },
  industry: {
    type: String,
  },
  startDayOfWeek: {
    type: String
  },
  businessAddress: {
    type: String,
  },
  totalEmployee: {
    type: String,
  },
  type: {
    type: String,
  },
  onboarding: {
    type: Boolean,
  }

}, { timestamps: true })

export default mongoose?.models?.User || mongoose.model("User", userSchema)

