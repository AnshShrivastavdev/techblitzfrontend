import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
  {
    certificateId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
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
    issuedAt: {
      type: Date,
      default: Date.now,
    },
    pdfUrl: {
      type: String,
      default: '',
    },
    attendancePercentage: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index ensuring one certificate per user per workshop
certificateSchema.index({ userId: 1, workshopId: 1 }, { unique: true });

export const Certificate = mongoose.model('Certificate', certificateSchema);
