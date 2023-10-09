import mongoose, { Schema } from 'mongoose';

const workspaceSchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    totalEmployees: {
      type: String,
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Workspace || mongoose.model("Workspace", workspaceSchema)

