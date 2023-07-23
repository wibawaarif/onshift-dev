import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    user: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
    },
    shifts: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Shift',
      }
    ],
    platform: {
      type: String,
      enum: ['Mobile App', 'Web Portal']
    }
}, { timestamps: true })

export default mongoose?.models?.Employee || mongoose?.model("Employee", employeeSchema)

