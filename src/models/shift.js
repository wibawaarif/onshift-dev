import mongoose, { Schema } from 'mongoose';
import location from './location';

const shiftSchema = new Schema({
  startTime: {
    type: Date
  },
  endTime: {
    type: Date
  },
  location: {
    type: mongoose.Types.ObjectId,
    ref: location,
    required: true,
  },
  radius: {
    type: Number
  }
}, { timestamps: true })

export default mongoose?.models?.Shift || mongoose.model("Shift", shiftSchema)

