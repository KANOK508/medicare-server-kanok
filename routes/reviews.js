const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/verifyToken');

// POST /api/reviews — submit a review
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const review = {
      ...req.body,
      patientEmail: req.user.email,
      createdAt: new Date(),
    };
    const result = await db.collection('reviews').insertOne(review);
    res.status(201).json({ insertedId: result.insertedId, message: 'Review submitted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/patient — patient's own reviews
router.get('/patient', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientEmail: req.user.email };
    const [reviews, total] = await Promise.all([
      db.collection('reviews').find(query).sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('reviews').countDocuments(query),
    ]);
    res.json({ reviews, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/reviews/doctor/:email — get reviews for a specific doctor (public)
router.get('/doctor/:email', async (req, res) => {
  try {
    const db = getDB();
    const reviews = await db.collection('reviews')
      .find({ doctorEmail: req.params.email })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();
    res.json({ reviews });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id — delete own review
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    await db.collection('reviews').deleteOne({
      _id: new ObjectId(req.params.id),
      patientEmail: req.user.email,
    });
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
