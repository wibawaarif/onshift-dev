import mongoose, { Schema } from 'mongoose';

const timesheetSchema = new Schema({
  date: {
    type: Date,
  },
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
    enum: ['Present', 'Absent', 'Late'],
    default: 'Present',
  },
  workspace: {
    type: String
  },
}, { timestamps: true })

export default mongoose?.models?.Timesheet || mongoose.model("Timesheet", timesheetSchema)

