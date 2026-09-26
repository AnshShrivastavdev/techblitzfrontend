import mongoose from 'mongoose';
import { Registration } from '../models/Registration.js';
import { Workshop } from '../models/Workshop.js';
import { sendEmail, getRegistrationEmailTemplate } from '../services/emailService.js';

// POST /api/workshops/:id/register - Participant Registration
export const registerForWorkshop = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Registration successful! (Demo Mode)',
        data: { _id: 'reg-demo-001', workshopId: req.params.id, status: 'registered' },
      });
    }
    const { id } = req.params;
    const userId = req.user._id;

    // 1. Check workshop exists
    const workshop = await Workshop.findById(id);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // 2. Check registration open
    if (!workshop.registrationOpen || workshop.status === 'cancelled' || workshop.status === 'completed') {
      return res.status(400).json({ success: false, message: 'Registration for this workshop is closed.' });
    }

    // 3. Check capacity limit
    const currentRegCount = await Registration.countDocuments({ workshopId: id, status: 'registered' });
    if (currentRegCount >= workshop.capacity) {
      return res.status(400).json({ success: false, message: 'Workshop capacity reached. No seats available.' });
    }

    // 4. Duplicate Check (App Level + DB Compound Index Level)
    const existing = await Registration.findOne({ userId, workshopId: id });
    if (existing && existing.status === 'registered') {
      return res.status(400).json({ success: false, message: 'You are already registered for this workshop.' });
    }

    let registration;
    if (existing && existing.status === 'cancelled') {
      existing.status = 'registered';
      existing.registeredAt = new Date();
      registration = await existing.save();
    } else {
      registration = await Registration.create({
        userId,
        workshopId: id,
        status: 'registered',
      });
    }

    // 5. Send Email Confirmation
    const dateStr = new Date(workshop.date).toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const timeStr = `${new Date(workshop.startTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} - ${new Date(workshop.endTime).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    
    sendEmail({
      to: req.user.email,
      subject: `TechBlitz 2.0 — Registration Confirmed: ${workshop.title}`,
      html: getRegistrationEmailTemplate(req.user.name, workshop.title, dateStr, timeStr),
    }).catch((err) => console.error('[Registration Email Background Error]:', err));

    return res.status(201).json({
      success: true,
      message: 'Registration successful! Confirmation email sent.',
      data: registration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'You are already registered for this workshop.' });
    }
    console.error('[RegisterForWorkshop Error]:', error);
    return res.status(500).json({ success: false, message: 'Registration failed.' });
  }
};

// DELETE /api/workshops/:id/register - Cancel Workshop Registration
export const unregisterFromWorkshop = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        message: 'Successfully cancelled workshop registration.',
      });
    }
    const { id } = req.params;
    const userId = req.user._id;

    const registration = await Registration.findOne({ userId, workshopId: id, status: 'registered' });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Active registration for this workshop not found.' });
    }

    registration.status = 'cancelled';
    await registration.save();

    return res.status(200).json({
      success: true,
      message: 'Successfully cancelled workshop registration.',
    });
  } catch (error) {
    console.error('[UnregisterFromWorkshop Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to cancel registration.' });
  }
};

// GET /api/me/workshops - Participant Registered Workshops + Protected GMeet Logic
export const getMyWorkshops = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        count: 1,
        data: [
          {
            _id: 'ws-001',
            title: 'Introduction to Generative AI & Agentic Systems',
            slug: 'intro-generative-ai',
            description: 'Explore the cutting edge of LLMs, agentic orchestration, tool-calling APIs, and autonomous AI workflows in this intensive hands-on session.',
            shortDescription: 'Master LLMs, prompt engineering, and autonomous agent orchestration.',
            date: new Date('2026-09-24T10:00:00Z'),
            startTime: new Date('2026-09-24T10:00:00Z'),
            endTime: new Date('2026-09-24T12:00:00Z'),
            isLive: true,
            isCompleted: false,
            gmeetProtected: false,
            gmeetLink: 'https://meet.google.com/tb2-genai-session',
          },
        ],
      });
    }
    const userId = req.user._id;
    const registrations = await Registration.find({ userId, status: 'registered' })
      .populate({
        path: 'workshopId',
        populate: { path: 'speakerId', select: 'name photo company designation' },
      })
      .sort({ registeredAt: -1 });

    const now = new Date();

    const result = registrations.map((reg) => {
      const w = reg.workshopId;
      if (!w) return null;

      const obj = w.toObject();
      const startTime = new Date(w.startTime);
      const endTime = new Date(w.endTime);

      // Server-authoritative GMeet access determination:
      // Must be registered AND current time within [startTime - 15 mins grace, endTime]
      const isLive = now >= new Date(startTime.getTime() - 15 * 60 * 1000) && now <= endTime;
      const isCompleted = now > endTime || w.status === 'completed';

      obj.isLive = isLive;
      obj.isCompleted = isCompleted;
      obj.registrationId = reg._id;
      obj.registeredAt = reg.registeredAt;

      // DO NOT expose GMeet URL unless live session window is open
      if (!isLive) {
        obj.gmeetLink = null;
        obj.gmeetProtected = true;
      } else {
        obj.gmeetProtected = false;
      }

      return obj;
    }).filter(Boolean);

    return res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error('[GetMyWorkshops Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch registered workshops.' });
  }
};

// POST /api/me/profile - Save/Update Participant Profile Details
export const updateParticipantProfile = async (req, res) => {
  try {
    const {
      name, fullName,
      phone, phoneNumber,
      institution,
      collegeRoll, collegeRollId,
      branch,
      semester,
      graduationYear,
      bio,
    } = req.body;
    const user = req.user;
    if (!user) {
      return res.status(401).json({ success: false, message: 'User session not found. Please log in again.' });
    }

    const finalName = name || fullName;
    const finalPhone = phone !== undefined ? phone : phoneNumber;
    const finalRoll = collegeRoll !== undefined ? collegeRoll : collegeRollId;

    if (finalName) user.name = finalName;
    if (finalPhone !== undefined) user.phone = finalPhone;
    if (institution !== undefined) user.institution = institution;
    if (finalRoll !== undefined) user.collegeRoll = finalRoll;
    if (branch !== undefined) user.branch = branch;
    if (semester !== undefined) user.semester = semester;
    if (graduationYear !== undefined) user.graduationYear = graduationYear;
    if (bio !== undefined) user.bio = bio;
    user.profileCompleted = true;

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Participant profile saved successfully.',
      user,
    });
  } catch (error) {
    console.error('[UpdateParticipantProfile Error]:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to update participant profile.' });
  }
};

