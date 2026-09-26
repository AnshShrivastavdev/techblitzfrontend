import mongoose from 'mongoose';

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    timezone: {
      type: String,
      default: 'Asia/Kolkata',
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    speakerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Speaker',
      required: true,
    },
    gmeetLink: {
      type: String,
      required: true,
      trim: true,
    },
    registrationOpen: {
      type: Boolean,
      default: true,
    },
    registrationClose: {
      type: Date,
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },
    certificateEligible: {
      type: Boolean,
      default: true,
    },
    attendanceRequiredPercentage: {
      type: Number,
      default: 75,
      min: 0,
      max: 100,
    },
    bannerImage: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'live', 'completed', 'cancelled'],
      default: 'published',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Workshop = mongoose.model('Workshop', workshopSchema);
