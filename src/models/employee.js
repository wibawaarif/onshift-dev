import mongoose, { Schema } from 'mongoose';
import user from './user';
import organization from './organization';

const employeeSchema = new Schema({
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    hireDate: {
      type: Date,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: user,
      required: true,
    },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: organization,
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Employee || mongoose.model("Employee", employeeSchema)

