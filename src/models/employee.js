import mongoose, { Schema } from 'mongoose';

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
      ref: 'User',
      required: true,
    },
    organization: {
      type: mongoose.Types.ObjectId,
      ref: 'Organization',
      required: true,
    }
}, { timestamps: true })

export default mongoose?.models?.Employee || mongoose.model("Employee", employeeSchema)

