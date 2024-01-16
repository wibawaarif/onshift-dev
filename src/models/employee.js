import mongoose, { Schema } from 'mongoose';

const employeeSchema = new Schema({
    name: {
      type: String,
    },
    employeeId: {
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
    timesheets: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'Timesheet',
      }
    ],
    platform: {
      type: String,
      enum: ['Mobile App', 'Web Portal']
    },
    positions: [{
      type: mongoose.Types.ObjectId,
      ref: 'Position',
    }],
    wageOptions: {
      category: {
        type: String,
        enum: ['Standard', 'Custom']
      },
      type: {
        type: String
      },
      amount: {
        type: Number,
      }
    },
    workspace: {
      type: String
    },
    status: {
      type: String,
      default: 'Active',
      enum: ['Active', 'Inactive']
    },
}, { timestamps: true })

// Middleware to generate employeeId
employeeSchema.pre('save', async function (next) {
  try {
    const maxEmployee = await this.constructor.findOne({}, {}, { sort: { employeeId: -1 } });

    if (maxEmployee) {
      const maxEmployeeId = parseInt(maxEmployee.employeeId);

      if (maxEmployeeId === 9999) {
        // If the counter reaches 9999, add a sequence part
        const currentSequence = maxEmployee.employeeId.split('-')[1] || 1;
        const nextSequence = parseInt(currentSequence) + 1;
        this.employeeId = `0001-${nextSequence}`.padStart(4, '0');
      } else {
        this.employeeId = (maxEmployeeId + 1).toString().padStart(4, '0');
      }
    } else {
      // If there are no employees yet, start from 0001
      this.employeeId = '0001';
    }

    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose?.models?.Employee || mongoose?.model("Employee", employeeSchema)

