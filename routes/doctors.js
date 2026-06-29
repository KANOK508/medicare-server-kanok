// const express = require('express');
// const router = express.Router();
// const { getDB } = require('../config/db');
// const { ObjectId } = require('mongodb');
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdmin = require('../middleware/verifyAdmin');
// const verifyDoctor = require('../middleware/verifyDoctor');

// // ─── IMPORTANT: specific routes MUST come before /:id wildcard ───────────────

// // GET /api/doctors/featured
// router.get('/featured', async (req, res) => {
//   try {
//     const db = getDB();
//     const doctors = await db.collection('doctors')
//       .find({ verificationStatus: 'verified' })
//       .sort({ experience: -1 })
//       .limit(6)
//       .toArray();
//     res.json(doctors);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/doctors/stats
// router.get('/stats', async (req, res) => {
//   try {
//     const db = getDB();
//     const [totalDoctors, totalPatients, totalAppointments, totalReviews] = await Promise.all([
//       db.collection('doctors').countDocuments({ verificationStatus: 'verified' }),
//       db.collection('users').countDocuments({ role: 'patient' }),
//       db.collection('appointments').countDocuments({}),
//       db.collection('reviews').countDocuments({}),
//     ]);
//     res.json({ totalDoctors, totalPatients, totalAppointments, totalReviews });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/doctors/my-profile (doctor)
// router.get('/my-profile', verifyToken, verifyDoctor, async (req, res) => {
//   try {
//     const db = getDB();
//     const doctor = await db.collection('doctors').findOne({ email: req.user.email });
//     if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
//     res.json(doctor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/doctors/admin/all (admin only)
// router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;
//   try {
//     const db = getDB();
//     const [doctors, total] = await Promise.all([
//       db.collection('doctors').find({}).skip(skip).limit(limit).toArray(),
//       db.collection('doctors').countDocuments({}),
//     ]);
//     res.json({ doctors, total, page, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/doctors?page=1&limit=8&specialization=&search= (public)
// router.get('/', async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 8;
//   const skip = (page - 1) * limit;
//   const search = req.query.search || '';
//   const specialization = req.query.specialization || '';
//   try {
//     const db = getDB();
//     const query = { verificationStatus: 'verified' };
//     if (search) {
//       query.$or = [
//         { doctorName: { $regex: search, $options: 'i' } },
//         { hospitalName: { $regex: search, $options: 'i' } },
//       ];
//     }
//     if (specialization) query.specialization = specialization;
//     const [doctors, total] = await Promise.all([
//       db.collection('doctors').find(query).skip(skip).limit(limit).toArray(),
//       db.collection('doctors').countDocuments(query),
//     ]);
//     res.json({ doctors, total, page, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/doctors/:id (public — must be LAST among GETs)
// router.get('/:id', async (req, res) => {
//   try {
//     const db = getDB();
//     if (!ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid doctor ID' });
//     }
//     const doctor = await db.collection('doctors').findOne({ _id: new ObjectId(req.params.id) });
//     if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
//     res.json(doctor);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST /api/doctors — register as doctor
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const exists = await db.collection('doctors').findOne({ email: req.user.email });
//     if (exists) return res.status(400).json({ message: 'Doctor profile already exists' });
//     const newDoctor = {
//       ...req.body,
//       email: req.user.email,
//       verificationStatus: 'pending',
//       createdAt: new Date(),
//     };
//     await db.collection('users').updateOne({ email: req.user.email }, { $set: { role: 'doctor' } });
//     const result = await db.collection('doctors').insertOne(newDoctor);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PATCH /api/doctors/my-profile — doctor updates own profile
// router.patch('/my-profile', verifyToken, verifyDoctor, async (req, res) => {
//   const { qualifications, experience, consultationFee, availableDays, availableSlots } = req.body;
//   try {
//     const db = getDB();
//     const result = await db.collection('doctors').updateOne(
//       { email: req.user.email },
//       { $set: { qualifications, experience, consultationFee, availableDays, availableSlots, updatedAt: new Date() } }
//     );
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PATCH /api/doctors/:id/verify (admin)
// router.patch('/:id/verify', verifyToken, verifyAdmin, async (req, res) => {
//   const { verificationStatus } = req.body;
//   try {
//     const db = getDB();
//     if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
//     const result = await db.collection('doctors').updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: { verificationStatus, updatedAt: new Date() } }
//     );
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE /api/doctors/:id (admin)
// router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = getDB();
//     if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
//     const result = await db.collection('doctors').deleteOne({ _id: new ObjectId(req.params.id) });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;





const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const verifyDoctor = require('../middleware/verifyDoctor');
 
// ─── IMPORTANT: specific routes MUST come before /:id wildcard ───────────────
 
// GET /api/doctors/featured
router.get('/featured', async (req, res) => {
  try {
    const db = getDB();
    const doctors = await db.collection('doctors')
      .find({ verificationStatus: 'verified' })
      .sort({ experience: -1 })
      .limit(6)
      .toArray();
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/doctors/stats
router.get('/stats', async (req, res) => {
  try {
    const db = getDB();
    const [totalDoctors, totalPatients, totalAppointments, totalReviews] = await Promise.all([
      db.collection('doctors').countDocuments({ verificationStatus: 'verified' }),
      db.collection('users').countDocuments({ role: 'patient' }),
      db.collection('appointments').countDocuments({}),
      db.collection('reviews').countDocuments({}),
    ]);
    res.json({ totalDoctors, totalPatients, totalAppointments, totalReviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/doctors/my-profile (doctor)
router.get('/my-profile', verifyToken, verifyDoctor, async (req, res) => {
  try {
    const db = getDB();
    const doctor = await db.collection('doctors').findOne({ email: req.user.email });
    if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/doctors/admin/all (admin only)
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  try {
    const db = getDB();
    const [doctors, total] = await Promise.all([
      db.collection('doctors').find({}).skip(skip).limit(limit).toArray(),
      db.collection('doctors').countDocuments({}),
    ]);
    res.json({ doctors, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/doctors?page=1&limit=8&specialization=&search= (public)
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 8;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';
  const specialization = req.query.specialization || '';
  const sortBy = req.query.sortBy || ''; // 'fee' | 'experience' | 'rating'
  try {
    const db = getDB();
    const query = { verificationStatus: 'verified' };
    if (search) {
      query.$or = [
        { doctorName: { $regex: search, $options: 'i' } },
        { hospitalName: { $regex: search, $options: 'i' } },
      ];
    }
    if (specialization) query.specialization = specialization;
 
    let sortOption = {};
    if (sortBy === 'fee') sortOption = { consultationFee: 1 };
    else if (sortBy === 'experience') sortOption = { experience: -1 };
    else if (sortBy === 'rating') sortOption = { averageRating: -1 };
 
    const [doctors, total] = await Promise.all([
      db.collection('doctors').find(query).sort(sortOption).skip(skip).limit(limit).toArray(),
      db.collection('doctors').countDocuments(query),
    ]);
    res.json({ doctors, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/doctors/:id (public — must be LAST among GETs)
router.get('/:id', async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid doctor ID' });
    }
    const doctor = await db.collection('doctors').findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json(doctor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// POST /api/doctors — self-register as doctor (any logged-in user)
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const exists = await db.collection('doctors').findOne({ email: req.user.email });
    if (exists) return res.status(400).json({ message: 'Doctor profile already exists' });
    const newDoctor = {
      ...req.body,
      email: req.user.email,
      verificationStatus: 'pending',
      createdAt: new Date(),
    };
    await db.collection('users').updateOne({ email: req.user.email }, { $set: { role: 'doctor' } });
    const result = await db.collection('doctors').insertOne(newDoctor);
    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// ─── NEW: POST /api/doctors/admin/add — Admin adds a doctor directly ─────────
// Admin can add a doctor profile for any email.
// If a user with that email exists → their role is updated to 'doctor'.
// If no user exists yet → a placeholder user is created with role 'doctor'.
// The doctor is immediately set to verificationStatus: 'verified'.
router.post('/admin/add', verifyToken, verifyAdmin, async (req, res) => {
  const {
    doctorName,
    email,
    specialization,
    qualifications,
    experience,
    consultationFee,
    hospitalName,
    profileImage,
    availableDays,
    availableSlots,
  } = req.body;
 
  if (!email || !doctorName || !specialization) {
    return res.status(400).json({ message: 'doctorName, email, and specialization are required' });
  }
 
  try {
    const db = getDB();
 
    // Check if a doctor profile already exists for this email
    const existingDoctor = await db.collection('doctors').findOne({ email });
    if (existingDoctor) {
      return res.status(400).json({ message: 'A doctor profile already exists for this email' });
    }
 
    // Upsert the user: if exists → update role to doctor, if not → create new user
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      await db.collection('users').updateOne(
        { email },
        { $set: { role: 'doctor', updatedAt: new Date() } }
      );
    } else {
      // Create a placeholder user account (they can register later with Firebase)
      await db.collection('users').insertOne({
        email,
        name: doctorName,
        photo: profileImage || '',
        role: 'doctor',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
 
    // Create the doctor profile — admin-added doctors are pre-verified
    const newDoctor = {
      doctorName,
      email,
      specialization,
      qualifications: qualifications || '',
      experience: Number(experience) || 0,
      consultationFee: Number(consultationFee) || 0,
      hospitalName: hospitalName || '',
      profileImage: profileImage || '',
      availableDays: availableDays || [],
      availableSlots: availableSlots || [],
      verificationStatus: 'verified', // Admin-added = auto verified
      createdAt: new Date(),
      updatedAt: new Date(),
    };
 
    const result = await db.collection('doctors').insertOne(newDoctor);
    res.status(201).json({ message: 'Doctor added successfully', doctorId: result.insertedId });
  } catch (err) {
    console.error('Admin add doctor error:', err);
    res.status(500).json({ message: err.message });
  }
});
 
// PATCH /api/doctors/my-profile — doctor updates own profile
router.patch('/my-profile', verifyToken, verifyDoctor, async (req, res) => {
  const { qualifications, experience, consultationFee, availableDays, availableSlots } = req.body;
  try {
    const db = getDB();
    const result = await db.collection('doctors').updateOne(
      { email: req.user.email },
      { $set: { qualifications, experience, consultationFee, availableDays, availableSlots, updatedAt: new Date() } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// PATCH /api/doctors/:id/verify (admin)
router.patch('/:id/verify', verifyToken, verifyAdmin, async (req, res) => {
  const { verificationStatus } = req.body;
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const result = await db.collection('doctors').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { verificationStatus, updatedAt: new Date() } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// DELETE /api/doctors/:id (admin)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid ID' });
    const result = await db.collection('doctors').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
module.exports = router;
 