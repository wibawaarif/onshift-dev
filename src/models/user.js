import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
  },
  username: {
    type: String,
  },
  password: {
    type: String,
  },
  role: {
    type: String,
  },
  type: {
    type: String,
  },
  emiratesId: {
    type: Number,
  },
  birthDate: {
    type: Date,
  },
  contacts: {
    type: Object
  },
  fatherName: {
    type: String,
  },
  motherName: {
    type: String,
  },
  totalProgramHours: {
    type: Number,
  },
  contract: {
    type: Object,
  },
  onboarding: {
    type: Boolean,
  }

}, { timestamps: true })

export default mongoose?.models?.User || mongoose.model("User", userSchema)

