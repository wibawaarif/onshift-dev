import mongoose, { Schema } from 'mongoose';

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
    ref: 'Employee'
  }],
  user: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    enum: ['Mobile App', 'Web Portal']
  },
  workspace: {
    type: String
  },
}, { timestamps: true })

export default mongoose?.models?.Position || mongoose.model("Position", positionSchema)

