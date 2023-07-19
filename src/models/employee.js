import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    user: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    timezone: {
      type: String,
    },
    shifts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Shift',
      }
    ],
    role: {
      type: String,
      enum: ['Employee', 'Administrator']
    }
}, { timestamps: true })

export default mongoose?.models?.Employee || mongoose?.model("Employee", employeeSchema)

