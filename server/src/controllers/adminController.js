import mongoose from 'mongoose';
import { stringify } from 'csv-stringify/sync';
import { User } from '../models/User.js';
import { Workshop } from '../models/Workshop.js';
import { Registration } from '../models/Registration.js';
import { Attendance } from '../models/Attendance.js';
import { Certificate } from '../models/Certificate.js';
import { Speaker } from '../models/Speaker.js';
import { Gallery, FAQ } from '../models/Content.js';
import { getFirebaseAuth, isFirebaseConfigured } from '../config/firebase.js';

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

// GET /api/admin/users - Admin Paginated Users List (Live Firebase Auth + MongoDB Cluster)
export const getAdminUsers = async (req, res) => {
  try {
    const { page = 1, limit = 100, search = '' } = req.query;

    // 1. Fetch live registered users from Firebase Auth Console in real-time
    let firebaseUsers = [];
    if (isFirebaseConfigured() && getFirebaseAuth()) {
      try {
        const listResult = await getFirebaseAuth().listUsers(1000);
        firebaseUsers = listResult.users.map((u) => {
          const emailLower = (u.email || '').toLowerCase().trim();
          const isAdmin = emailLower === (process.env.ADMIN_EMAIL || 'cosmos.jec@jecjabalpur.ac.in').toLowerCase() || u.uid === 'Q4meaY8di1Tz5syyVo0kbIdTIba2';
          return {
            id: u.uid,
            firebaseUid: u.uid,
            email: emailLower,
            name: u.displayName || (emailLower ? emailLower.split('@')[0] : 'Participant'),
            role: isAdmin ? 'admin' : 'student',
            phone: u.phoneNumber || '',
            institution: 'Jabalpur Engineering College',
            college: 'Jabalpur Engineering College',
            branch: 'CSE',
            createdAt: u.metadata?.creationTime ? new Date(u.metadata.creationTime) : new Date(),
          };
        });
        console.log(`[GetAdminUsers] Retrieved ${firebaseUsers.length} live users from Firebase Auth.`);
      } catch (fbErr) {
        console.warn('[GetAdminUsers] Firebase listUsers notice:', fbErr.message);
      }
    }

    // 2. If MongoDB cluster is connected, ensure Firebase users are upserted into MongoDB
    if (mongoose.connection.readyState === 1) {
      for (const fbUser of firebaseUsers) {
        if (!fbUser.email) continue;
        try {
          const exists = await User.findOne({
            $or: [{ email: fbUser.email }, { firebaseUid: fbUser.firebaseUid }],
          });
          if (!exists) {
            await User.create({
              firebaseUid: fbUser.firebaseUid,
              name: fbUser.name,
              email: fbUser.email,
              role: fbUser.role,
              institution: fbUser.institution,
              branch: fbUser.branch,
              phone: fbUser.phone,
              profileCompleted: true,
              createdAt: fbUser.createdAt,
            });
          } else if (!exists.firebaseUid && fbUser.firebaseUid) {
            exists.firebaseUid = fbUser.firebaseUid;
            await exists.save();
          }
        } catch {
          // ignore duplicate collision
        }
      }

      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { branch: { $regex: search, $options: 'i' } },
          { institution: { $regex: search, $options: 'i' } },
          { collegeRoll: { $regex: search, $options: 'i' } },
        ];
      }

      const total = await User.countDocuments(query);
      const users = await User.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit));

      // Enrich with workshop registrations and certificates
      const enrichedUsers = await Promise.all(
        users.map(async (u) => {
          const regCount = await Registration.countDocuments({ userId: u._id, status: 'registered' });
          const certCount = await Certificate.countDocuments({ userId: u._id });
          const obj = u.toObject();
          obj.registeredWorkshopsCount = regCount;
          obj.certificatesCount = certCount;
          obj.college = obj.institution || obj.college || 'Jabalpur Engineering College';
          obj.rollNumber = obj.collegeRoll || obj.rollNumber || '';
          return obj;
        })
      );

      // Merge any Firebase users that might not be returned in this paginated page
      const returnedEmails = new Set(enrichedUsers.map((u) => u.email.toLowerCase()));
      const pendingFb = firebaseUsers.filter((u) => !returnedEmails.has(u.email));

      const mergedList = [...enrichedUsers, ...pendingFb];

      return res.status(200).json({
        success: true,
        total: Math.max(total, mergedList.length),
        page: Number(page),
        pages: Math.ceil(Math.max(total, mergedList.length) / Number(limit)) || 1,
        data: mergedList,
      });
    }

    // 3. Fallback when MongoDB is in transit: return Firebase Auth real-time users
    let filteredFb = firebaseUsers;
    if (search) {
      const q = search.toLowerCase();
      filteredFb = filteredFb.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.branch && u.branch.toLowerCase().includes(q))
      );
    }

    const total = filteredFb.length;
    const paginated = filteredFb.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));

    return res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
      data: paginated,
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

const DEFAULT_SPEAKERS = [
  {
    name: 'Dr. Sudhir Kumar Mishra',
    designation: 'Former Director General, DRDO & Former CEO & MD',
    company: 'DRDO / BrahMos Aerospace',
    photo: '/speakers/sudhir-kumar-mishra.png',
    bio: 'JEC 1982 Alumnus. Distinguished defence leader and former CEO & MD of BrahMos Aerospace and Director General at DRDO, Ministry of Defence.',
    batch: '1982',
    education: 'Jabalpur Engineering College (1982) • NIT Warangal',
    category: 'Defence & Aerospace',
  },
  {
    name: 'Vinayak Chaturvedi',
    designation: 'Software Engineer III',
    company: 'Google',
    photo: '/speakers/vinayak-chaturvedi.jpg',
    bio: 'JEC 2018 Alumnus. Software Engineer III at Google Hyderabad; ex-Goldman Sachs, D. E. Shaw, and Infosys; M.Tech from IIIT Bangalore.',
    batch: '2018',
    education: 'B.E. JEC (2014–2018) • IIIT Bangalore',
    category: 'Big Tech & Systems',
  },
  {
    name: 'Shrey Tiwari',
    designation: 'Graduate Engineer Trainee',
    company: 'Reliance Industries Limited',
    photo: '/speakers/shrey-tiwari.jpg',
    bio: 'JEC 2023 Alumnus. Graduate Engineer Trainee at Reliance Industries Limited. Advanced research in Instrument Technology at IIT Delhi; key contributor to TEJASH EV project.',
    batch: '2023',
    education: 'JEC (2019–2023) • IIT Delhi',
    category: 'Core Industry',
  },
  {
    name: 'Rishabh Khampariya',
    designation: 'Lead Product Analyst & Chief Mentor',
    company: 'Housing.com / edAnalytix',
    photo: '/speakers/rishabh-khampariya.jpg',
    bio: 'JEC Alumnus. 7+ years in product and business analytics across Amazon, Microsoft client analytics, Axis Bank, Mu Sigma, and Housing.',
    batch: 'JEC Alumnus',
    education: 'Jabalpur Engineering College',
    category: 'AI & Data Science',
  },
  {
    name: 'Tanu Chaurasiya',
    designation: 'Member of Technical Staff 2 (MTS-2)',
    company: 'Adobe',
    photo: '/speakers/tanu-chaurasiya.jpg',
    bio: 'JEC 2022 Alumna. Member of Technical Staff at Adobe Noida. Former Senior Member of Technical Staff at Siemens EDA and Samsung R&D Institute India.',
    batch: '2022',
    education: 'B.E. JEC (2018–2022, 8.28 CGPA)',
    category: 'Big Tech & Systems',
  },
  {
    name: 'Prashant Dutta',
    designation: 'Manager (Information Technology)',
    company: 'MP Electricity Board (MPEB)',
    photo: '',
    bio: 'JEC 2006 Alumnus. 20+ years of IT leadership across Satyam, academia, and enterprise cloud migrations, smart metering, and GIS at MPEB.',
    batch: '2006',
    education: 'B.E. JEC (2002–2006)',
    category: 'Core Industry',
  },
  {
    name: 'Ashish Onkar',
    designation: 'SAP Technology Specialist',
    company: 'Cognizant',
    photo: '',
    bio: 'JEC 2018 Alumnus. 15+ years SAP enterprise experience with certifications in SAP Data Services (BODS), S/4HANA Production Planning, and enterprise transformations.',
    batch: '2018',
    education: 'B.E. JEC (2014–2018)',
    category: 'Big Tech & Systems',
  },
  {
    name: 'Siddharth Chouksey',
    designation: 'Systems Software Engineer',
    company: 'Hitachi / ex-Secureworks',
    photo: '/speakers/siddharth-chouksey.jpg',
    bio: 'JEC Alumnus. Systems programmer specializing in C++, Linux internals, and cybersecurity endpoint detection & response (EDR); M.Tech BITS Pilani.',
    batch: 'JEC Alumnus',
    education: 'JEC • BITS Pilani Hyderabad',
    category: 'Big Tech & Systems',
  },
  {
    name: 'Rajit Gupta',
    designation: 'Data Engineer',
    company: 'American Express',
    photo: '/speakers/rajit-gupta.jpg',
    bio: 'JEC 2021 Alumnus. Data Engineer at American Express Gurugram; Google Cloud Certified Professional Data Engineer; Smart India Hackathon team lead.',
    batch: '2021',
    education: 'B.Tech JEC (2017–2021)',
    category: 'AI & Data Science',
  },
  {
    name: 'Shailendra Namdev',
    designation: 'Data Scientist (AI/ML & Operations Research)',
    company: 'Flipkart',
    photo: '/speakers/shailendra-namdev.jpg',
    bio: 'JEC 2020 Alumnus. Data Scientist at Flipkart; M.Tech from IIT Bombay (IEOR) with master’s thesis on network optimization for RBI; ex-Delhivery.',
    batch: '2020',
    education: 'B.E. JEC (2016–2020) • IIT Bombay (2021–2023)',
    category: 'AI & Data Science',
  },
];

// CRUD for Content (Speakers, Gallery, FAQs)
export const getSpeakers = async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      let speakers = await Speaker.find().sort({ createdAt: 1 });
      if (speakers.length === 0) {
        // Auto-seed default speakers into MongoDB
        await Speaker.insertMany(DEFAULT_SPEAKERS);
        speakers = await Speaker.find().sort({ createdAt: 1 });
      }
      return res.status(200).json({ success: true, data: speakers });
    }
    return res.status(200).json({ success: true, data: DEFAULT_SPEAKERS });
  } catch (err) {
    return res.status(200).json({ success: true, data: DEFAULT_SPEAKERS });
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

// DELETE /api/admin/users/:id - Delete a user in real-time from MongoDB & Firebase Auth
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let targetFirebaseUid = null;

    // 1. Delete from MongoDB
    if (mongoose.connection.readyState === 1) {
      const isObjectId = mongoose.isValidObjectId(id);
      const userDoc = await User.findOne({
        $or: [
          ...(isObjectId ? [{ _id: id }] : []),
          { firebaseUid: id },
          { email: id.toLowerCase() },
        ],
      });

      if (userDoc) {
        targetFirebaseUid = userDoc.firebaseUid;
        await User.findByIdAndDelete(userDoc._id);
        await Registration.deleteMany({ userId: userDoc._id });
        await Attendance.deleteMany({ userId: userDoc._id });
      }
    }

    // 2. If id is a Firebase UID or we found targetFirebaseUid, purge from Firebase Auth
    const fbUidToDelete = targetFirebaseUid || (id.length > 20 && !id.includes('@') ? id : null);
    if (fbUidToDelete && isFirebaseConfigured() && getFirebaseAuth()) {
      try {
        await getFirebaseAuth().deleteUser(fbUidToDelete);
        console.log(`[DeleteUser] Removed user from Firebase Auth: ${fbUidToDelete}`);
      } catch (fbErr) {
        console.warn(`[DeleteUser] Firebase Auth deletion notice: ${fbErr.message}`);
      }
    }

    return res.status(200).json({ success: true, message: 'Student removed successfully in real-time from database and Firebase Auth.' });
  } catch (error) {
    console.error('[DeleteUser Error]:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};


