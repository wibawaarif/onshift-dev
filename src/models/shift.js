import mongoose, { Schema } from 'mongoose';
import location from './location';
import position from './position';
import employee from './employee';

const shiftSchema = new Schema({
  date: {
    type: Date,
  },
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  location: {
    type: mongoose.Types.ObjectId,
    ref: location,
  },
  position: {
    type: mongoose.Types.ObjectId,
    ref: 'Position',
  },
  employees: [{
    type: mongoose.Types.ObjectId,
    ref: 'Employee',
  }],
  notes: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.Shift || mongoose.model("Shift", shiftSchema)

