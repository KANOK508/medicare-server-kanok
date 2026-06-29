const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/verifyToken');
const verifyDoctor = require('../middleware/verifyDoctor');

// POST /api/prescriptions — doctor creates a prescription
router.post('/', verifyToken, verifyDoctor, async (req, res) => {
  try {
    const db = getDB();
    const prescription = {
      ...req.body,
      doctorEmail: req.user.email,
      createdAt: new Date(),
    };
    const result = await db.collection('prescriptions').insertOne(prescription);
    res.status(201).json({ insertedId: result.insertedId, message: 'Prescription created' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/prescriptions/doctor — doctor's prescriptions they issued
router.get('/doctor', verifyToken, verifyDoctor, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { doctorEmail: req.user.email };
    const [prescriptions, total] = await Promise.all([
      db.collection('prescriptions').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('prescriptions').countDocuments(query),
    ]);
    res.json({ prescriptions, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/prescriptions/patient — patient's prescriptions
router.get('/patient', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const prescriptions = await db.collection('prescriptions')
      .find({ patientEmail: req.user.email })
      .sort({ createdAt: -1 })
      .toArray();
    res.json({ prescriptions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// added 

// GET /api/prescriptions/:id — get single prescription
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const prescription = await db.collection('prescriptions').findOne({ _id: new ObjectId(req.params.id) });
    if (!prescription) return res.status(404).json({ message: 'Not found' });
    res.json(prescription);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
