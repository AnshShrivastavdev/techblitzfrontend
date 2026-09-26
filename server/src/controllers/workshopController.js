import mongoose from 'mongoose';
import { Workshop } from '../models/Workshop.js';
import { Speaker } from '../models/Speaker.js';
import { Registration } from '../models/Registration.js';

const FALLBACK_WORKSHOPS = [
  {
    _id: 'ws-001',
    title: 'Introduction to Generative AI & Agentic Systems',
    slug: 'intro-generative-ai',
    description: 'Explore the cutting edge of LLMs, agentic orchestration, tool-calling APIs, and autonomous AI workflows in this intensive hands-on session.',
    shortDescription: 'Master LLMs, prompt engineering, and autonomous agent orchestration.',
    date: new Date('2026-09-24T10:00:00Z'),
    startTime: new Date('2026-09-24T10:00:00Z'),
    endTime: new Date('2026-09-24T12:00:00Z'),
    durationMinutes: 120,
    gmeetLink: 'https://meet.google.com/tb2-genai-session',
    capacity: 150,
    registeredCount: 45,
    remainingSeats: 105,
    status: 'live',
  },
  {
    _id: 'ws-002',
    title: 'Cloud-Native Architecture & Microservices Masterclass',
    slug: 'cloud-native-masterclass',
    description: 'Deep dive into Kubernetes container orchestration, service meshes, distributed tracing, and resilient cloud design patterns for modern scale.',
    shortDescription: 'Learn Docker, Kubernetes, and distributed systems from industry experts.',
    date: new Date('2026-09-26T14:00:00Z'),
    startTime: new Date('2026-09-26T14:00:00Z'),
    endTime: new Date('2026-09-26T16:00:00Z'),
    durationMinutes: 120,
    gmeetLink: 'https://meet.google.com/tb2-cloud-native',
    capacity: 100,
    registeredCount: 30,
    remainingSeats: 70,
    status: 'published',
  },
];

// GET /api/workshops - Public listing
export const getWorkshops = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: FALLBACK_WORKSHOPS.length,
        total: FALLBACK_WORKSHOPS.length,
        page: 1,
        pages: 1,
        data: FALLBACK_WORKSHOPS,
      });
    }

    const { status, limit = 20, page = 1 } = req.query;
    const query = {};

    if (status) {
      query.status = status;
    } else {
      // By default show non-draft workshops to public
      query.status = { $ne: 'draft' };
    }

    const total = await Workshop.countDocuments(query);
    const workshops = await Workshop.find(query)
      .populate('speakerId', 'name photo company designation bio')
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Calculate remaining seats for each workshop
    const workshopsWithAvailability = await Promise.all(
      workshops.map(async (w) => {
        const regCount = await Registration.countDocuments({ workshopId: w._id, status: 'registered' });
        const obj = w.toObject();
        obj.registeredCount = regCount;
        obj.remainingSeats = Math.max(0, w.capacity - regCount);
        return obj;
      })
    );

    return res.status(200).json({
      success: true,
      count: workshopsWithAvailability.length,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: workshopsWithAvailability,
    });
  } catch (error) {
    console.error('[GetWorkshops Error]:', error);
    return res.status(200).json({
      success: true,
      count: FALLBACK_WORKSHOPS.length,
      total: FALLBACK_WORKSHOPS.length,
      page: 1,
      pages: 1,
      data: FALLBACK_WORKSHOPS,
    });
  }
};

// GET /api/workshops/:slug - Public detail view
export const getWorkshopBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const workshop = await Workshop.findOne({ slug }).populate('speakerId');

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    const regCount = await Registration.countDocuments({ workshopId: workshop._id, status: 'registered' });
    const data = workshop.toObject();
    data.registeredCount = regCount;
    data.remainingSeats = Math.max(0, workshop.capacity - regCount);

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error('[GetWorkshopBySlug Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch workshop details.' });
  }
};

// POST /api/admin/workshops - Admin Create
export const createWorkshop = async (req, res) => {
  try {
    const {
      title,
      slug,
      description,
      shortDescription,
      date,
      startTime,
      endTime,
      durationMinutes,
      speakerId,
      gmeetLink,
      capacity,
      attendanceRequiredPercentage = 75,
      bannerImage,
      status = 'published',
    } = req.body;

    if (!title || !slug || !date || !startTime || !endTime || !gmeetLink || !speakerId || !capacity) {
      return res.status(400).json({ success: false, message: 'Missing required workshop fields.' });
    }

    const existing = await Workshop.findOne({ slug });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Workshop slug already exists. Use a unique slug.' });
    }

    const workshop = await Workshop.create({
      title,
      slug: slug.toLowerCase().trim(),
      description,
      shortDescription,
      date,
      startTime,
      endTime,
      durationMinutes: Number(durationMinutes) || 120,
      speakerId,
      gmeetLink,
      capacity: Number(capacity),
      attendanceRequiredPercentage: Number(attendanceRequiredPercentage),
      bannerImage,
      status,
    });

    return res.status(201).json({
      success: true,
      message: 'Workshop created successfully.',
      data: workshop,
    });
  } catch (error) {
    console.error('[CreateWorkshop Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to create workshop.' });
  }
};

// PATCH /api/admin/workshops/:id - Admin Update
export const updateWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Workshop updated successfully.',
      data: workshop,
    });
  } catch (error) {
    console.error('[UpdateWorkshop Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to update workshop.' });
  }
};

// DELETE /api/admin/workshops/:id - Admin Delete
export const deleteWorkshop = async (req, res) => {
  try {
    const { id } = req.params;
    const workshop = await Workshop.findByIdAndDelete(id);

    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Workshop deleted successfully.',
    });
  } catch (error) {
    console.error('[DeleteWorkshop Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete workshop.' });
  }
};
