import mongoose from 'mongoose';

const speakerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    photo: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    linkedin: {
      type: String,
      default: '',
    },
    website: {
      type: String,
      default: '',
    },
    batch: {
      type: String,
      default: '',
    },
    education: {
      type: String,
      default: '',
    },
    domain: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: 'Big Tech & Systems',
    },
    isKeynote: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const Speaker = mongoose.model('Speaker', speakerSchema);
