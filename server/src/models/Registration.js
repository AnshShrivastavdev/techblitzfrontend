import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workshop',
      required: true,
      index: true,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['registered', 'cancelled'],
      default: 'registered',
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring a user cannot register for the same workshop twice
registrationSchema.index({ userId: 1, workshopId: 1 }, { unique: true });

export const Registration = mongoose.model('Registration', registrationSchema);
