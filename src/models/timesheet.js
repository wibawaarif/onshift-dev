import mongoose, { Schema } from 'mongoose';

const timesheetSchema = new Schema({
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  employee: {
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  status: {
    type: String,
    enum: ['Present', 'Absent'],
    default: 'Present',
  }
}, { timestamps: true })

export default mongoose?.models?.Timesheet || mongoose.model("Timesheet", timesheetSchema)

