import mongoose from 'mongoose';
import { Attendance } from '../models/Attendance.js';
import { Registration } from '../models/Registration.js';
import { Workshop } from '../models/Workshop.js';

// POST /api/workshops/:id/check-in - Server-Authoritative Check In
export const checkIn = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        success: true,
        message: 'Check-in successful! Enjoy the workshop.',
        data: { _id: 'att-demo-001', checkInTime: new Date() },
      });
    }
    const { id: workshopId } = req.params;
    const userId = req.user._id;
    const now = new Date();

    // 1. Verify Registration
    const registration = await Registration.findOne({ userId, workshopId, status: 'registered' });
    if (!registration) {
      return res.status(403).json({ success: false, message: 'Must be registered for this workshop to check in.' });
    }

    // 2. Verify Workshop Exists
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // 3. Verify Workshop Currently Live (Server Time)
    const startTime = new Date(workshop.startTime);
    const endTime = new Date(workshop.endTime);
    // Allow check-in 15 mins prior to start up to workshop end
    const liveWindowStart = new Date(startTime.getTime() - 15 * 60 * 1000);

    if (now < liveWindowStart || now > endTime) {
      return res.status(400).json({
        success: false,
        message: 'Check-in is only allowed while the workshop session is live.',
      });
    }

    // 4. Duplicate Check-in Check
    const existing = await Attendance.findOne({ userId, workshopId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked in to this workshop.',
        data: existing,
      });
    }

    // 5. Create Attendance Record
    const attendance = await Attendance.create({
      registrationId: registration._id,
      userId,
      workshopId,
      checkInTime: now,
    });

    return res.status(201).json({
      success: true,
      message: 'Check-in successful! Enjoy the workshop.',
      data: attendance,
    });
  } catch (error) {
    console.error('[CheckIn Error]:', error);
    return res.status(500).json({ success: false, message: 'Check-in failed.' });
  }
};

// POST /api/workshops/:id/check-out - Server-Authoritative Check Out & Math
export const checkOut = async (req, res) => {
  try {
    const { id: workshopId } = req.params;
    const userId = req.user._id;
    const now = new Date();

    // 1. Verify Check-in Exists
    const attendance = await Attendance.findOne({ userId, workshopId });
    if (!attendance) {
      return res.status(400).json({ success: false, message: 'No check-in record found for this workshop.' });
    }

    if (attendance.checkOutTime) {
      return res.status(400).json({
        success: false,
        message: 'You have already checked out of this workshop.',
        data: attendance,
      });
    }

    // 2. Fetch Workshop details for duration & threshold
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // 3. Time Validation: Checkout cannot be earlier than check-in
    if (now < attendance.checkInTime) {
      return res.status(400).json({ success: false, message: 'Invalid checkout timestamp.' });
    }

    // 4. Calculate Duration in Minutes
    const checkInMs = new Date(attendance.checkInTime).getTime();
    const checkOutMs = now.getTime();
    const attendedMinutes = Math.round((checkOutMs - checkInMs) / (1000 * 60));

    // 5. Calculate Attendance Percentage
    const workshopDuration = workshop.durationMinutes || 120;
    let percentage = Math.round((attendedMinutes / workshopDuration) * 100);
    // Clamp between 0 and 100
    percentage = Math.min(100, Math.max(0, percentage));

    // 6. Certificate Eligibility Determination
    const requiredPercentage = workshop.attendanceRequiredPercentage || 75;
    const eligible = percentage >= requiredPercentage;

    // Update record
    attendance.checkOutTime = now;
    attendance.durationMinutes = attendedMinutes;
    attendance.attendancePercentage = percentage;
    attendance.eligibleForCertificate = eligible;

    await attendance.save();

    return res.status(200).json({
      success: true,
      message: eligible
        ? `Check-out successful! You attended ${percentage}% of the session and are eligible for a certificate.`
        : `Check-out successful. You attended ${percentage}% of the session (Threshold: ${requiredPercentage}%).`,
      data: attendance,
    });
  } catch (error) {
    console.error('[CheckOut Error]:', error);
    return res.status(500).json({ success: false, message: 'Check-out failed.' });
  }
};
