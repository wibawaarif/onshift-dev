import mongoose, { Schema } from 'mongoose';
import employee from './employee';

const positionSchema = new Schema({
  name: {
    type: String,
  },
  color: {
    type: String,
  },
  wageType: {
    type: String,
  },
  wageAmount: {
    type: Number,
  },
  employees: [{
    type: Schema.Types.ObjectId,
    ref: employee
  }],
  user: {
    type: String,
  }
}, { timestamps: true })

export default mongoose?.models?.Position || mongoose.model("Position", positionSchema)

