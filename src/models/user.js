import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema({
  email: {
    type: String,
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
}, { timestamps: true })

export default mongoose?.models?.User || mongoose.model("User", userSchema)

