import mongoose, { Schema } from 'mongoose';
import user from './user';
import organization from './organization';

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
    role: {
      type: String,
      enum: ['Employee', 'Administrator']
    }
}, { timestamps: true })

export default mongoose?.models?.Employee || mongoose.model("Employee", employeeSchema)

