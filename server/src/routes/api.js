import express from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import {
  getWorkshops,
  getWorkshopBySlug,
  createWorkshop,
  updateWorkshop,
  deleteWorkshop,
} from '../controllers/workshopController.js';
import {
  registerForWorkshop,
  unregisterFromWorkshop,
  getMyWorkshops,
  updateParticipantProfile,
} from '../controllers/registrationController.js';
import {
  checkIn,
  checkOut,
} from '../controllers/attendanceController.js';
import {
  getMyCertificates,
  downloadCertificate,
  verifyCertificate,
  generateWorkshopCertificates,
} from '../controllers/certificateController.js';
import {
  getAdminStats,
  getAdminUsers,
  getAdminWorkshopAttendance,
  exportAttendanceCSV,
  getSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
  getGallery,
  createGalleryItem,
  deleteGalleryItem,
  getFAQs,
  createFAQ,
  updateFAQ,
  deleteFAQ,
} from '../controllers/adminController.js';

const router = express.Router();

// ==========================================
// 1. PUBLIC ROUTES (Unauthenticated)
// ==========================================
router.get('/workshops', getWorkshops);
router.get('/workshops/:slug', getWorkshopBySlug);
router.get('/speakers', getSpeakers);
router.get('/gallery', getGallery);
router.get('/faqs', getFAQs);
router.get('/certificates/:certificateId/verify', verifyCertificate);

// ==========================================
// 2. PARTICIPANT / USER ROUTES (Require Auth)
// ==========================================
router.get('/me', requireAuth, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});
router.post('/me/profile', requireAuth, updateParticipantProfile);
router.get('/me/workshops', requireAuth, getMyWorkshops);
router.get('/me/certificates', requireAuth, getMyCertificates);
router.post('/workshops/:id/register', requireAuth, registerForWorkshop);
router.delete('/workshops/:id/register', requireAuth, unregisterFromWorkshop);
router.post('/workshops/:id/check-in', requireAuth, checkIn);
router.post('/workshops/:id/check-out', requireAuth, checkOut);
router.get('/certificates/:id/download', requireAuth, downloadCertificate);

// ==========================================
// 3. ADMIN ROUTES (Require Auth + Server-Side Admin Authorization)
// ==========================================
router.get('/admin/stats', requireAuth, requireAdmin, getAdminStats);
router.get('/admin/users', requireAuth, requireAdmin, getAdminUsers);

// Workshop Admin CRUD
router.post('/admin/workshops', requireAuth, requireAdmin, createWorkshop);
router.patch('/admin/workshops/:id', requireAuth, requireAdmin, updateWorkshop);
router.delete('/admin/workshops/:id', requireAuth, requireAdmin, deleteWorkshop);

// Attendance Oversight & CSV Export
router.get('/admin/workshops/:id/attendance', requireAuth, requireAdmin, getAdminWorkshopAttendance);
router.get('/admin/workshops/:id/export-csv', requireAuth, requireAdmin, exportAttendanceCSV);

// Certificate Bulk Generation & Distribution
router.post('/admin/workshops/:id/generate-certificates', requireAuth, requireAdmin, generateWorkshopCertificates);

// Speaker Admin CRUD
router.post('/admin/speakers', requireAuth, requireAdmin, createSpeaker);
router.patch('/admin/speakers/:id', requireAuth, requireAdmin, updateSpeaker);
router.delete('/admin/speakers/:id', requireAuth, requireAdmin, deleteSpeaker);

// Gallery Admin CRUD
router.post('/admin/gallery', requireAuth, requireAdmin, createGalleryItem);
router.delete('/admin/gallery/:id', requireAuth, requireAdmin, deleteGalleryItem);

// FAQ Admin CRUD
router.post('/admin/faqs', requireAuth, requireAdmin, createFAQ);
router.patch('/admin/faqs/:id', requireAuth, requireAdmin, updateFAQ);
router.delete('/admin/faqs/:id', requireAuth, requireAdmin, deleteFAQ);

export default router;
