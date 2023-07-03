import mongoose, { Schema } from 'mongoose';

const scheduleSchema = new Schema({
    organization: {
      type: mongoose.Types.ObjectId,
      ref: 'Organization',
      required: true,
    },
    shift: {
      type: mongoose.Types.ObjectId,
      ref: 'Shift',
      required: true,
    },  
    employee: {
      type: mongoose.Types.ObjectId,
      ref: 'Employee',
      required: true,
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
}, { timestamps: true })

export default mongoose?.models?.Schedule || mongoose.model("Schedule", scheduleSchema)

