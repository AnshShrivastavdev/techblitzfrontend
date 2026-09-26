import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      default: 'TechBlitz 1.0',
    },
    eventYear: {
      type: String,
      default: '2025',
    },
  },
  {
    timestamps: true,
  }
);

export const Gallery = mongoose.model('Gallery', gallerySchema);

const faqSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      default: 'General',
    },
  },
  {
    timestamps: true,
  }
);

export const FAQ = mongoose.model('FAQ', faqSchema);
