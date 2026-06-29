/**
 * MediCare Connect — Database Seed Script
 *
 * Usage:
 *   1. Make sure your .env file has the correct MONGODB_URI
 *   2. Run: node seed.js
 *
 * This inserts sample data into MongoDB. Safe to run multiple times —
 * it checks for existing data before inserting.
 */

require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('❌ MONGODB_URI not found in .env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
});

const doctors = [
  {
    doctorName: 'Dr. Frank Brown',
    email: 'frank@example.com',
    specialization: 'Cardiology',
    qualifications: ['MBBS', 'MD (Cardiology)', 'FACC'],
    hospitalName: 'City Heart Hospital',
    experience: 12,
    consultationFee: 120,
    profileImage: 'https://randomuser.me/api/portraits/men/6.jpg',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Grace Lee',
    email: 'grace@example.com',
    specialization: 'Pediatrics',
    qualifications: ['MBBS', 'MD (Pediatrics)', 'MRCPCH'],
    hospitalName: "Children's Medical Center",
    experience: 8,
    consultationFee: 90,
    profileImage: 'https://randomuser.me/api/portraits/women/7.jpg',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '04:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. James Thomas',
    email: 'james@example.com',
    specialization: 'Neurology',
    qualifications: ['MBBS', 'DM (Neurology)', 'FRCP'],
    hospitalName: 'NeuroHealth Institute',
    experience: 15,
    consultationFee: 150,
    profileImage: 'https://randomuser.me/api/portraits/men/10.jpg',
    availableDays: ['Monday', 'Tuesday', 'Thursday'],
    availableSlots: ['09:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Sophia Rodriguez',
    email: 'sophia@example.com',
    specialization: 'Dermatology',
    qualifications: ['MBBS', 'MD (Dermatology)'],
    hospitalName: 'SkinCare Clinic',
    experience: 6,
    consultationFee: 80,
    profileImage: 'https://randomuser.me/api/portraits/women/11.jpg',
    availableDays: ['Wednesday', 'Friday', 'Saturday'],
    availableSlots: ['10:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Liam Garcia',
    email: 'liam@example.com',
    specialization: 'Orthopedics',
    qualifications: ['MBBS', 'MS (Orthopedics)', 'FRCS'],
    hospitalName: 'Bone & Joint Center',
    experience: 10,
    consultationFee: 110,
    profileImage: 'https://randomuser.me/api/portraits/men/22.jpg',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '03:00 PM', '04:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Olivia Chen',
    email: 'olivia@example.com',
    specialization: 'Gynecology',
    qualifications: ['MBBS', 'MD (OB/GYN)', 'FACOG'],
    hospitalName: "Women's Wellness Clinic",
    experience: 9,
    consultationFee: 100,
    profileImage: 'https://randomuser.me/api/portraits/women/33.jpg',
    availableDays: ['Tuesday', 'Thursday', 'Saturday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '03:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Noah Patel',
    email: 'noah@example.com',
    specialization: 'General Practice',
    qualifications: ['MBBS', 'MRCGP'],
    hospitalName: 'Community Health Center',
    experience: 5,
    consultationFee: 60,
    profileImage: 'https://randomuser.me/api/portraits/men/44.jpg',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    availableSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Ava Kim',
    email: 'ava@example.com',
    specialization: 'Psychiatry',
    qualifications: ['MBBS', 'MD (Psychiatry)', 'MRCPsych'],
    hospitalName: 'MindCare Hospital',
    experience: 11,
    consultationFee: 130,
    profileImage: 'https://randomuser.me/api/portraits/women/55.jpg',
    availableDays: ['Monday', 'Wednesday', 'Friday'],
    availableSlots: ['09:00 AM', '11:00 AM', '02:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. William Nguyen',
    email: 'william@example.com',
    specialization: 'Ophthalmology',
    qualifications: ['MBBS', 'MS (Ophthalmology)', 'FRCS (Ophth)'],
    hospitalName: 'VisionCare Eye Hospital',
    experience: 14,
    consultationFee: 100,
    profileImage: 'https://randomuser.me/api/portraits/men/66.jpg',
    availableDays: ['Tuesday', 'Thursday'],
    availableSlots: ['10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM'],
    verificationStatus: 'pending',
    createdAt: new Date(),
  },
  {
    doctorName: 'Dr. Mia Singh',
    email: 'mia@example.com',
    specialization: 'Endocrinology',
    qualifications: ['MBBS', 'DM (Endocrinology)'],
    hospitalName: 'DiabetesCare Clinic',
    experience: 7,
    consultationFee: 110,
    profileImage: 'https://randomuser.me/api/portraits/women/77.jpg',
    availableDays: ['Monday', 'Wednesday', 'Saturday'],
    availableSlots: ['09:00 AM', '10:00 AM', '03:00 PM', '05:00 PM'],
    verificationStatus: 'verified',
    createdAt: new Date(),
  },
];

const users = [
  { name: 'Alice Admin',      email: 'alice@example.com',    photo: 'https://randomuser.me/api/portraits/women/1.jpg',  role: 'admin',   status: 'active', createdAt: new Date() },
  { name: 'Bob Williams',     email: 'bob@example.com',      photo: 'https://randomuser.me/api/portraits/men/2.jpg',    role: 'patient', status: 'active', createdAt: new Date() },
  { name: 'Carol Davis',      email: 'carol@example.com',    photo: 'https://randomuser.me/api/portraits/women/3.jpg',  role: 'patient', status: 'active', createdAt: new Date() },
  { name: 'David Martinez',   email: 'david@example.com',    photo: 'https://randomuser.me/api/portraits/men/4.jpg',    role: 'patient', status: 'active', createdAt: new Date() },
  { name: 'Emma Wilson',      email: 'emma@example.com',     photo: 'https://randomuser.me/api/portraits/women/5.jpg',  role: 'patient', status: 'active', createdAt: new Date() },
  { name: 'Frank Brown',      email: 'frank@example.com',    photo: 'https://randomuser.me/api/portraits/men/6.jpg',    role: 'doctor',  status: 'active', createdAt: new Date() },
  { name: 'Grace Lee',        email: 'grace@example.com',    photo: 'https://randomuser.me/api/portraits/women/7.jpg',  role: 'doctor',  status: 'active', createdAt: new Date() },
  { name: 'James Thomas',     email: 'james@example.com',    photo: 'https://randomuser.me/api/portraits/men/10.jpg',   role: 'doctor',  status: 'active', createdAt: new Date() },
  { name: 'Isabella Anderson',email: 'isabella@example.com', photo: 'https://randomuser.me/api/portraits/women/9.jpg',  role: 'patient', status: 'active', createdAt: new Date() },
  { name: 'Henry Taylor',     email: 'henry@example.com',    photo: 'https://randomuser.me/api/portraits/men/8.jpg',    role: 'patient', status: 'suspended', createdAt: new Date() },
];

async function seed() {
  try {
    await client.connect();
    const db = client.db('medicareDB');
    console.log('✅ Connected to MongoDB\n');

    // Seed users
    let usersInserted = 0;
    for (const u of users) {
      const exists = await db.collection('users').findOne({ email: u.email });
      if (!exists) { await db.collection('users').insertOne(u); usersInserted++; }
    }
    console.log(`👤 Users: ${usersInserted} inserted (${users.length - usersInserted} already existed)`);

    // Seed doctors
    let doctorsInserted = 0;
    for (const d of doctors) {
      const exists = await db.collection('doctors').findOne({ email: d.email });
      if (!exists) { await db.collection('doctors').insertOne(d); doctorsInserted++; }
    }
    console.log(`🩺 Doctors: ${doctorsInserted} inserted (${doctors.length - doctorsInserted} already existed)`);

    console.log('\n🎉 Seeding complete! You can now log in as:');
    console.log('   Admin:   alice@example.com  (set via MongoDB Atlas)');
    console.log('   Doctors: frank@example.com, grace@example.com, james@example.com');
    console.log('   Patients: bob@example.com, carol@example.com, david@example.com\n');
    console.log('Note: These are MongoDB records only. You still need to create');
    console.log('matching Firebase accounts with the same emails to log in.\n');

  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await client.close();
  }
}

seed();
