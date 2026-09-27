import mongoose from 'mongoose';
import { stringify } from 'csv-stringify/sync';
import { User } from '../models/User.js';
import { Workshop } from '../models/Workshop.js';
import { Registration } from '../models/Registration.js';
import { Attendance } from '../models/Attendance.js';
import { Certificate } from '../models/Certificate.js';
import { Speaker } from '../models/Speaker.js';
import { Gallery, FAQ } from '../models/Content.js';

// GET /api/admin/stats - Admin Dashboard High-level Metrics
export const getAdminStats = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: {
          totalUsers: 0,
          totalWorkshops: 0,
          totalRegistrations: 0,
          totalCertificates: 0,
          liveWorkshops: 0,
          completedWorkshops: 0,
          eligibleParticipants: 0,
        },
      });
    }
    const totalUsers = await User.countDocuments();
    const totalWorkshops = await Workshop.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: 'registered' });
    const totalCertificates = await Certificate.countDocuments();
    const liveWorkshops = await Workshop.countDocuments({ status: 'live' });
    const completedWorkshops = await Workshop.countDocuments({ status: 'completed' });
    const eligibleParticipants = await Attendance.countDocuments({ eligibleForCertificate: true });

    return res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalWorkshops,
        totalRegistrations,
        totalCertificates,
        liveWorkshops,
        completedWorkshops,
        eligibleParticipants,
      },
    });
  } catch (error) {
    console.error('[GetAdminStats Error]:', error);
    return res.status(200).json({
      success: true,
      data: {
        totalUsers: 0,
        totalWorkshops: 0,
        totalRegistrations: 0,
        totalCertificates: 0,
        liveWorkshops: 0,
        completedWorkshops: 0,
        eligibleParticipants: 0,
      },
    });
  }
};

// GET /api/admin/users - Admin Paginated Users List
export const getAdminUsers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        total: 0,
        page: 1,
        pages: 0,
        data: [],
      });
    }
    const { page = 1, limit = 20, search = '' } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    // Enrich with participation metrics
    const enrichedUsers = await Promise.all(
      users.map(async (u) => {
        const regCount = await Registration.countDocuments({ userId: u._id, status: 'registered' });
        const certCount = await Certificate.countDocuments({ userId: u._id });
        const obj = u.toObject();
        obj.registeredWorkshopsCount = regCount;
        obj.certificatesCount = certCount;
        return obj;
      })
    );

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: enrichedUsers,
    });
  } catch (error) {
    console.error('[GetAdminUsers Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users list.' });
  }
};

// GET /api/admin/workshops/:id/attendance - Workshop Attendance Dashboard
export const getAdminWorkshopAttendance = async (req, res) => {
  try {
    const { id: workshopId } = req.params;
    const { page = 1, limit = 50, eligible, search = '' } = req.query;

    const workshop = await Workshop.findById(workshopId).populate('speakerId', 'name');
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    // Fetch all registrations for this workshop
    const regQuery = { workshopId, status: 'registered' };
    const registrations = await Registration.find(regQuery).populate('userId', 'name email phone');

    // Aggregate attendance and certificate information
    const attendanceRecords = await Attendance.find({ workshopId });
    const certificates = await Certificate.find({ workshopId });

    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId.toString(), a]));
    const certMap = new Map(certificates.map((c) => [c.userId.toString(), c]));

    let rows = registrations.map((reg) => {
      const u = reg.userId;
      if (!u) return null;
      const att = attendanceMap.get(u._id.toString());
      const cert = certMap.get(u._id.toString());

      return {
        registrationId: reg._id,
        userId: u._id,
        name: u.name,
        email: u.email,
        phone: u.phone || 'N/A',
        checkInTime: att ? att.checkInTime : null,
        checkOutTime: att ? att.checkOutTime : null,
        durationMinutes: att ? att.durationMinutes : 0,
        attendancePercentage: att ? att.attendancePercentage : 0,
        eligible: att ? att.eligibleForCertificate : false,
        certificateId: cert ? cert.certificateId : null,
        certificateIssued: !!cert,
      };
    }).filter(Boolean);

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
    }

    if (eligible === 'true') {
      rows = rows.filter((r) => r.eligible === true);
    } else if (eligible === 'false') {
      rows = rows.filter((r) => r.eligible === false);
    }

    const total = rows.length;
    const paginatedRows = rows.slice((page - 1) * limit, page * limit);

    return res.status(200).json({
      success: true,
      workshopTitle: workshop.title,
      stats: {
        totalRegistered: registrations.length,
        totalCheckedIn: attendanceRecords.length,
        totalEligible: attendanceRecords.filter((a) => a.eligibleForCertificate).length,
        totalCertificatesIssued: certificates.length,
      },
      total,
      page: Number(page),
      pages: Math.ceil(total / limit),
      data: paginatedRows,
    });
  } catch (error) {
    console.error('[GetAdminWorkshopAttendance Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch attendance data.' });
  }
};

// GET /api/admin/workshops/:id/export-csv - Admin CSV Export Endpoint
export const exportAttendanceCSV = async (req, res) => {
  try {
    const { id: workshopId } = req.params;
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({ success: false, message: 'Workshop not found.' });
    }

    const registrations = await Registration.find({ workshopId, status: 'registered' }).populate('userId');
    const attendanceRecords = await Attendance.find({ workshopId });
    const certificates = await Certificate.find({ workshopId });

    const attendanceMap = new Map(attendanceRecords.map((a) => [a.userId.toString(), a]));
    const certMap = new Map(certificates.map((c) => [c.userId.toString(), c]));

    const csvData = registrations.map((reg, idx) => {
      const u = reg.userId;
      const att = attendanceMap.get(u._id.toString());
      const cert = certMap.get(u._id.toString());

      return {
        'S.No': idx + 1,
        'Participant Name': u.name,
        Email: u.email,
        Phone: u.phone || 'N/A',
        'Check-In Time': att && att.checkInTime ? new Date(att.checkInTime).toLocaleString('en-IN') : 'Not Checked In',
        'Check-Out Time': att && att.checkOutTime ? new Date(att.checkOutTime).toLocaleString('en-IN') : 'Not Checked Out',
        'Attended Duration (Mins)': att ? att.durationMinutes : 0,
        'Attendance %': att ? `${att.attendancePercentage}%` : '0%',
        'Eligible For Certificate': att && att.eligibleForCertificate ? 'YES' : 'NO',
        'Certificate ID': cert ? cert.certificateId : 'N/A',
      };
    });

    const csvString = stringify(csvData, { header: true });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="attendance-${workshop.slug}.csv"`);
    return res.status(200).send(csvString);
  } catch (error) {
    console.error('[ExportAttendanceCSV Error]:', error);
    return res.status(500).json({ success: false, message: 'Failed to export CSV.' });
  }
};

// CRUD for Content (Speakers, Gallery, FAQs)
export const getSpeakers = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [],
      });
    }
    const speakers = await Speaker.find().sort({ name: 1 });
    return res.status(200).json({ success: true, data: speakers });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
};

export const createSpeaker = async (req, res) => {
  const speaker = await Speaker.create(req.body);
  return res.status(201).json({ success: true, data: speaker });
};

export const updateSpeaker = async (req, res) => {
  const speaker = await Speaker.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({ success: true, data: speaker });
};

export const deleteSpeaker = async (req, res) => {
  await Speaker.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: 'Speaker deleted.' });
};

export const getGallery = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [
          {
            _id: 'gal-001',
            imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600',
            caption: 'AI Workshop Keynote',
            category: 'Workshops',
          },
          {
            _id: 'gal-002',
            imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600',
            caption: 'Hackathon Winners',
            category: 'Hackathons',
          },
        ],
      });
    }
    const gallery = await Gallery.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data: gallery });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
};

export const createGalleryItem = async (req, res) => {
  const item = await Gallery.create(req.body);
  return res.status(201).json({ success: true, data: item });
};

export const deleteGalleryItem = async (req, res) => {
  await Gallery.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: 'Gallery item deleted.' });
};

export const getFAQs = async (req, res) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(200).json({
        success: true,
        data: [
          {
            _id: 'faq-001',
            question: 'How do I register for workshops?',
            answer: 'Log in to your student dashboard and click Register.',
            category: 'Registration',
            order: 1,
          },
          {
            _id: 'faq-002',
            question: 'How are certificates issued?',
            answer: 'Certificates are automatically generated upon session completion.',
            category: 'Certificates',
            order: 2,
          },
        ],
      });
    }
    const faqs = await FAQ.find().sort({ order: 1 });
    return res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    return res.status(200).json({ success: true, data: [] });
  }
};

export const createFAQ = async (req, res) => {
  const faq = await FAQ.create(req.body);
  return res.status(201).json({ success: true, data: faq });
};

export const updateFAQ = async (req, res) => {
  const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, { new: true });
  return res.status(200).json({ success: true, data: faq });
};

export const deleteFAQ = async (req, res) => {
  await FAQ.findByIdAndDelete(req.params.id);
  return res.status(200).json({ success: true, message: 'FAQ deleted.' });
};

// POST /api/students/sync - Sync student from Firebase into MongoDB
export const syncStudent = async (req, res) => {
  try {
    const { id, uid, firebaseUid, name, email, role = 'student', college, institution, branch, semester, rollNumber, collegeRoll, phone } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email required' });
    }
    const finalUid = uid || firebaseUid || id;
    const finalCollege = college || institution || 'Jabalpur Engineering College';
    const finalRoll = rollNumber || collegeRoll || '';

    if (mongoose.connection.readyState === 1) {
      let user = await User.findOne({
        $or: [{ email: email.toLowerCase() }, ...(finalUid ? [{ firebaseUid: finalUid }] : [])],
      });
      if (!user) {
        user = await User.create({
          firebaseUid: finalUid,
          name: name || 'TechBlitz Participant',
          email: email.toLowerCase(),
          role: role === 'admin' ? 'admin' : 'student',
          institution: finalCollege,
          branch: branch || 'CSE',
          semester: semester || '',
          collegeRoll: finalRoll,
          phone: phone || '',
          profileCompleted: true,
        });
      } else {
        if (name) user.name = name;
        if (finalCollege) user.institution = finalCollege;
        if (branch) user.branch = branch;
        if (semester) user.semester = semester;
        if (finalRoll) user.collegeRoll = finalRoll;
        if (phone) user.phone = phone;
        if (finalUid) user.firebaseUid = finalUid;
        await user.save();
      }
      return res.status(200).json({ success: true, user });
    }
    return res.status(200).json({ success: true, message: 'Synced (DB standalone mode)' });
  } catch (error) {
    console.error('[SyncStudent Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/admin/users/:id - Delete a user in real-time from MongoDB
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (mongoose.connection.readyState === 1) {
      const isObjectId = mongoose.isValidObjectId(id);
      await User.findOneAndDelete({
        $or: [
          ...(isObjectId ? [{ _id: id }] : []),
          { firebaseUid: id },
          { email: id.toLowerCase() },
        ],
      });
      await Registration.deleteMany({ userId: id });
      await Attendance.deleteMany({ userId: id });
    }
    return res.status(200).json({ success: true, message: 'Student removed successfully from MongoDB.' });
  } catch (error) {
    console.error('[DeleteUser Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


