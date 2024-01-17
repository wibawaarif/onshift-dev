import mongoose, { Schema } from 'mongoose';

const timeOffRequesttSchema = new Schema({
  date: {
    type: Date
  },
  employee: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: String,
    default: 'Requested',
    enum: ['Requested', 'Approved', 'Disapproved']
  },
  reason: {
    type: String,
  },
  workspace: {
    type: String
  },
  approvedAt: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.TimeOffRequest || mongoose.model("TimeOffRequest", timeOffRequesttSchema)

