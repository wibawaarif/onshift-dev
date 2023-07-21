import mongoose, { Schema } from 'mongoose';

const shiftSchema = new Schema({
  date: {
    type: Date,
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  break: {
    type: String,
  },
  location: {
    type: mongoose.Types.ObjectId,
    ref: 'Location',
  },
  position: {
    type: mongoose.Types.ObjectId,
    ref: 'Position',
  },
  employees: [{
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
  }],
  repeatedShift: {
    isRepeated: {
      type: Boolean,
    },
    startRepeatedWeek: {
      type: Date,
    },
    repeatedDays: [{
      type: String,
    }],
    endDate: {
      type: Date,
    }
  },
  notes: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.Shift || mongoose.model("Shift", shiftSchema)

