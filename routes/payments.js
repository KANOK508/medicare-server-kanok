const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// POST /api/payments/create-payment-intent
router.post('/create-payment-intent', verifyToken, async (req, res) => {
  try {
    const { amount } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // convert to cents
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/payments — save payment record after successful Stripe payment
router.post('/', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const payment = {
      ...req.body,
      patientEmail: req.user.email,
      paymentDate: new Date(),
    };
    const result = await db.collection('payments').insertOne(payment);

    // Mark appointment as paid
    if (payment.appointmentId) {
      const { ObjectId } = require('mongodb');
      await db.collection('appointments').updateOne(
        { _id: new ObjectId(payment.appointmentId) },
        { $set: { paymentStatus: 'paid', appointmentStatus: 'confirmed' } }
      );
    }

    res.status(201).json({ insertedId: result.insertedId, message: 'Payment recorded' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/patient — patient's payment history
router.get('/patient', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 8 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const query = { patientEmail: req.user.email };
    const [payments, total] = await Promise.all([
      db.collection('payments').find(query).sort({ paymentDate: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('payments').countDocuments(query),
    ]);
    res.json({ payments, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/payments/admin/all — admin view all payments
router.get('/admin/all', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [payments, total] = await Promise.all([
      db.collection('payments').find().sort({ paymentDate: -1 }).skip(skip).limit(parseInt(limit)).toArray(),
      db.collection('payments').countDocuments(),
    ]);
    res.json({ payments, total, totalPages: Math.ceil(total / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
