import mongoose, { Schema } from 'mongoose';

const locationSchema = new Schema({
    name: {
      type: String,
      trim: true,
      required: true,
    },
    locationId: {
      type: String,
    },
    address: {
      type: String,
    },
    latitude: {
      type: String,
    },
    longitude: {
      type: String,
    },
    radius: {
      type: Number,
    },
    user: {
      type: String,
      required: true,
    },
    workspace: {
      type: String
    },
}, { timestamps: true })

// Middleware to generate locationId
locationSchema.pre('save', async function (next) {
  try {
    const maxEmployee = await this.constructor.findOne({}, {}, { sort: { locationId: -1 } });

    if (maxEmployee) {
      const maxlocationId = parseInt(maxEmployee.locationId);

      if (maxlocationId === 9999) {
        // If the counter reaches 9999, add a sequence part
        const currentSequence = maxEmployee.locationId.split('-')[1] || 1;
        const nextSequence = parseInt(currentSequence) + 1;
        this.locationId = `0001-${nextSequence}`.padStart(4, '0');
      } else {
        this.locationId = (maxlocationId + 1).toString().padStart(4, '0');
      }
    } else {
      // If there are no employees yet, start from 0001
      this.locationId = '0001';
    }

    next();
  } catch (error) {
    next(error);
  }
});


export default mongoose?.models?.Location || mongoose.model("Location", locationSchema)

