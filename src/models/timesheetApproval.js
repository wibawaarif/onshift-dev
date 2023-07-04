import mongoose, { Schema } from 'mongoose';

const timesheetApprovalSchema = new Schema({
  timesheet: {
    type: mongoose.Types.ObjectId,
    ref: 'Timesheet',
    required: true,
  },
  approver: {
    type: String
  },
  status: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.TimesheetApproval || mongoose.model("TimesheetApproval", timesheetApprovalSchema)

