// const express = require('express');
// const router = express.Router();
// const { getDB } = require('../config/db');
// const { ObjectId } = require('mongodb');
// const verifyToken = require('../middleware/verifyToken');
// const verifyAdmin = require('../middleware/verifyAdmin');

// // POST /api/users — create or update user on login
// router.post('/', async (req, res) => {
//   const user = req.body;
//   if (!user?.email) return res.status(400).json({ message: 'Email required' });
//   try {
//     const db = getDB();
//     const exists = await db.collection('users').findOne({ email: user.email });
//     if (exists) return res.json({ message: 'User already exists', insertedId: null });

//     const newUser = {
//       ...user,
//       role: user.role || 'patient',
//       status: 'active',
//       createdAt: new Date(),
//     };
//     const result = await db.collection('users').insertOne(newUser);
//     res.status(201).json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/users/me
// router.get('/me', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const user = await db.collection('users').findOne(
//       { email: req.user.email },
//       { projection: { password: 0 } }
//     );
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET /api/users/role/:email
// router.get('/role/:email', verifyToken, async (req, res) => {
//   try {
//     const db = getDB();
//     const user = await db.collection('users').findOne({ email: req.params.email });
//     res.json({ role: user?.role || 'patient' });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PATCH /api/users/me — update own profile
// router.patch('/me', verifyToken, async (req, res) => {
//   const { name, photo, phone, gender } = req.body;
//   try {
//     const db = getDB();
//     const result = await db.collection('users').updateOne(
//       { email: req.user.email },
//       { $set: { name, photo, phone, gender, updatedAt: new Date() } }
//     );
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ── ADMIN ROUTES ─────────────────────────────────────────────────────────────

// // GET /api/users?page=1&limit=10
// router.get('/', verifyToken, verifyAdmin, async (req, res) => {
//   const page = parseInt(req.query.page) || 1;
//   const limit = parseInt(req.query.limit) || 10;
//   const skip = (page - 1) * limit;
//   const search = req.query.search || '';

//   try {
//     const db = getDB();
//     const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
//     const [users, total] = await Promise.all([
//       db.collection('users').find(query, { projection: { password: 0 } }).skip(skip).limit(limit).toArray(),
//       db.collection('users').countDocuments(query),
//     ]);
//     res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // PATCH /api/users/:id/status
// router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
//   const { status } = req.body;
//   try {
//     const db = getDB();
//     const result = await db.collection('users').updateOne(
//       { _id: new ObjectId(req.params.id) },
//       { $set: { status, updatedAt: new Date() } }
//     );
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE /api/users/:id
// router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
//   try {
//     const db = getDB();
//     const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// module.exports = router;
// --------






const express = require('express');
const router = express.Router();
const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const verifyToken = require('../middleware/verifyToken');
const verifyAdmin = require('../middleware/verifyAdmin');

// POST /api/users — Upsert user (Create if new, Update info if existing, Preserve Role)
router.post('/', async (req, res) => {
  const { email, name, photo } = req.body;
  
  if (!email) return res.status(400).json({ message: 'Email required' });

  try {
    const db = getDB();
    const existingUser = await db.collection('users').findOne({ email: email });

    if (existingUser) {
      // If user exists, update profile info but DO NOT touch the 'role' field
      const result = await db.collection('users').findOneAndUpdate(
        { email: email },
        { 
          $set: { 
            name: name || existingUser.name, 
            photo: photo || existingUser.photo,
            updatedAt: new Date()
          } 
        },
        { returnDocument: 'after' }
      );
      return res.status(200).json({ message: "User profile updated", user: result });
    }

    // If new user, set default role to 'patient'
    const newUser = {
      email,
      name: name || "User",
      photo: photo || "",
      role: 'patient',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(newUser);
    res.status(201).json({ message: "New user created", user: result });
  } catch (err) {
    console.error("Backend Sync Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/me
router.get('/me', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne(
      { email: req.user.email },
      { projection: { password: 0 } }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/users/role/:email
router.get('/role/:email', verifyToken, async (req, res) => {
  try {
    const db = getDB();
    const user = await db.collection('users').findOne({ email: req.params.email });
    res.json({ role: user?.role || 'patient' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/users/me — update own profile
router.patch('/me', verifyToken, async (req, res) => {
  const { name, photo, phone, gender } = req.body;
  try {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { email: req.user.email },
      { $set: { name, photo, phone, gender, updatedAt: new Date() } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADMIN ROUTES
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search || '';

  try {
    const db = getDB();
    const query = search ? { $or: [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] } : {};
    const [users, total] = await Promise.all([
      db.collection('users').find(query, { projection: { password: 0 } }).skip(skip).limit(limit).toArray(),
      db.collection('users').countDocuments(query),
    ]);
    res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  const { status } = req.body;
  try {
    const db = getDB();
    const result = await db.collection('users').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status, updatedAt: new Date() } }
    );
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('users').deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;