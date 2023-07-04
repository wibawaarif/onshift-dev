import mongoose, { Schema } from 'mongoose';

const timeOffRequesttSchema = new Schema({
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  employee: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: String,
  },
  reason: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.TimeOffRequest || mongoose.model("TimeOffRequest", timeOffRequesttSchema)

