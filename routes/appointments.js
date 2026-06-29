// const express = require('express');
// const router = express.Router();
// const { getDB } = require('../config/db');
// const { ObjectId } = require('mongodb');
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdmin = require('../middleware/verifyAdmin');
// const verifyDoctor = require('../middleware/verifyDoctor');

// // POST /api/appointments — book an appointment (patient)
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const appointment = {
//       ...req.body,
//       patientEmail: req.user.email,
//       appointmentStatus: 'pending',
//       paymentStatus: 'unpaid',
//       createdAt: new Date(),
//     };
//     const result = await db.collection('appointments').insertOne(appointment);
//     res.status(201).json({ insertedId: result.insertedId, message: 'Appointment booked' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/appointments/patient — patient's own appointments
// router.get('/patient', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 8 } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const query = { patientEmail: req.user.email };
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(query),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/appointments/doctor — doctor's appointments
// router.get('/doctor', verifyToken, verifyDoctor, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 8, status } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const query = { doctorEmail: req.user.email };
//     if (status) query.appointmentStatus = status;
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(query),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/appointments/doctor/stats — doctor stats
// router.get('/doctor/stats', verifyToken, verifyDoctor, async (req, res) => {
//   try {
//     const db = getDB();
//     const email = req.user.email;
//     const today = new Date().toISOString().split('T')[0];
//     const [totalPatients, todayAppointments, totalReviews] = await Promise.all([
//       db.collection('appointments').distinct('patientEmail', { doctorEmail: email }),
//       db.collection('appointments').countDocuments({ doctorEmail: email, appointmentDate: today }),
//       db.collection('reviews').countDocuments({ doctorEmail: email }),
//     ]);
//     res.json({ totalPatients: totalPatients.length, todayAppointments, totalReviews });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/appointments/admin/all — admin view all
// router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PATCH /api/appointments/:id/status — update appointment status
// router.patch('/:id/status', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const { appointmentStatus } = req.body;
//     await db.collection('appointments').updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: { appointmentStatus, updatedAt: new Date() } }
//     );
//     res.json({ message: 'Status updated' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;










// const express = require('express');
// const router = express.Router();
// const { getDB } = require('../config/db');
// const { ObjectId } = require('mongodb');
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdmin = require('../middleware/verifyAdmin');
// const verifyDoctor = require('../middleware/verifyDoctor');
 
// // POST /api/appointments — book an appointment (patient)
// router.post('/', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const appointment = {
//       ...req.body,
//       patientEmail: req.user.email,
//       appointmentStatus: 'pending',
//       paymentStatus: 'unpaid',
//       createdAt: new Date(),
//     };
//     const result = await db.collection('appointments').insertOne(appointment);
//     res.status(201).json({ insertedId: result.insertedId, message: 'Appointment booked' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // GET /api/appointments/patient — patient's own appointments
// router.get('/patient', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 8 } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const query = { patientEmail: req.user.email };
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(query),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // GET /api/appointments/doctor — doctor's appointments
// router.get('/doctor', verifyToken, verifyDoctor, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 8, status } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const query = { doctorEmail: req.user.email };
//     if (status) query.appointmentStatus = status;
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(query),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // GET /api/appointments/doctor/stats — doctor stats
// router.get('/doctor/stats', verifyToken, verifyDoctor, async (req, res) => {
//   try {
//     const db = getDB();
//     const email = req.user.email;
//     const today = new Date().toISOString().split('T')[0];
//     const [totalPatients, todayAppointments, totalReviews] = await Promise.all([
//       db.collection('appointments').distinct('patientEmail', { doctorEmail: email }),
//       db.collection('appointments').countDocuments({ doctorEmail: email, appointmentDate: today }),
//       db.collection('reviews').countDocuments({ doctorEmail: email }),
//     ]);
//     res.json({ totalPatients: totalPatients.length, todayAppointments, totalReviews });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // GET /api/appointments/admin/all — admin view all
// router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = getDB();
//     const { page = 1, limit = 10 } = req.query;
//     const skip = (parseInt(page) - 1) * parseInt(limit);
//     const [appointments, total] = await Promise.all([
//       db.collection('appointments').find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
//       db.collection('appointments').countDocuments(),
//     ]);
//     res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // ─── BUG FIX: GET /api/appointments/:id ──────────────────────────────────────
// // এই route আগে ছিল না — CheckoutPage এটা call করত কিন্তু 404 পেত
// // Patient শুধু নিজের appointment দেখতে পারবে
// router.get('/:id', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
 
//     if (!ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ message: 'Invalid appointment ID' });
//     }
 
//     const appointment = await db.collection('appointments').findOne({
//       _id: new ObjectId(req.params.id),
//       patientEmail: req.user.email,   // security: নিজের appointment ছাড়া দেখতে পারবে না
//     });
 
//     if (!appointment) {
//       return res.status(404).json({ message: 'Appointment not found' });
//     }
 
//     res.json(appointment);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
 
// // PATCH /api/appointments/:id/status — update appointment status
// router.patch('/:id/status', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const { appointmentStatus } = req.body;
//     await db.collection('appointments').updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: { appointmentStatus, updatedAt: new Date() } }
//     );
//     res.json({ message: 'Status updated' });
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
 
// POST /api/appointments — book an appointment (patient)
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const appointment = {
      ...req.body,
      patientEmail: req.user.email,
      appointmentStatus: 'pending',
      paymentStatus: 'unpaid',
      createdAt: new Date(),
    };
    const result = await db.collection('appointments').insertOne(appointment);
    res.status(201).json({ insertedId: result.insertedId, message: 'Appointment booked' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/appointments/patient — patient's own appointments
router.get('/patient', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientEmail: req.user.email };
    const [appointments, total] = await Promise.all([
      db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('appointments').countDocuments(query),
    ]);
    res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/appointments/doctor — doctor's appointments
router.get('/doctor', verifyToken, verifyDoctor, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 8, status } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { doctorEmail: req.user.email };
    if (status) query.appointmentStatus = status;
    const [appointments, total] = await Promise.all([
      db.collection('appointments').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('appointments').countDocuments(query),
    ]);
    res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)), page: parseInt(page) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/appointments/doctor/stats — doctor dashboard stats
// FIX 1: todayAppointments — appointmentDate is stored as day name (e.g. "Wednesday")
//         so we match by day name, not ISO date string
// FIX 2: totalReviews — query by doctorEmail (consistent with reviews collection)
// FIX 3: totalPatients — count distinct patientEmails for this doctor
router.get('/doctor/stats', verifyToken, verifyDoctor, async (req, res) => {
  try {
    const db = getDB();
    const email = req.user.email;
 
    // Get today's day name e.g. "Monday", "Wednesday"
    const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
 
    const [totalPatientsArr, todayAppointments, totalReviews] = await Promise.all([
      // distinct patientEmails who booked this doctor
      db.collection('appointments').distinct('patientEmail', { doctorEmail: email }),
 
      // match by day name since appointmentDate is stored as "Monday", "Wednesday" etc.
      db.collection('appointments').countDocuments({
        doctorEmail: email,
        appointmentDate: todayName,
      }),
 
      // reviews for this doctor by email
      db.collection('reviews').countDocuments({ doctorEmail: email }),
    ]);
 
    res.json({
      totalPatients: totalPatientsArr.length,
      todayAppointments,
      totalReviews,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/appointments/admin/all — admin view all
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [appointments, total] = await Promise.all([
      db.collection('appointments').find().sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('appointments').countDocuments(),
    ]);
    res.json({ appointments, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// GET /api/appointments/:id — single appointment (for checkout page)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid appointment ID' });
    }
    const appointment = await db.collection('appointments').findOne({
      _id: new ObjectId(req.params.id),
      patientEmail: req.user.email,
    });
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
// PATCH /api/appointments/:id/status — update appointment status
router.patch('/:id/status', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { appointmentStatus } = req.body;
    await db.collection('appointments').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { appointmentStatus, updatedAt: new Date() } }
    );
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
 
module.exports = router;