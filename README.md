# MediCare Connect — Server

Express + MongoDB REST API for the MediCare Connect healthcare platform.

## Quick Start

```bash
npm install
cp .env.example .env   # fill in your values
npm run dev            # http://localhost:5000

# Optional: seed 10 doctors + 10 users into the database
node seed.js
```

## Environment Variables

| Variable | Description |
|---|---|
| `PORT` | Port (default 5000) |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Long random string for signing JWTs |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `CLIENT_URL` | Deployed client URL (for CORS) |

## API Endpoints

### Auth
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/jwt | Issue JWT token |
| POST | /api/auth/logout | Logout |

### Users
| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/users | - | Register user |
| GET | /api/users/me | Token | Get own profile |
| GET | /api/users/role/:email | Token | Get role |
| PATCH | /api/users/me | Token | Update profile |
| GET | /api/users | Admin | All users (paginated) |
| PATCH | /api/users/:id/status | Admin | Suspend/activate |
| DELETE | /api/users/:id | Admin | Delete user |

### Doctors
| Method | Route | Auth | Description |
|---|---|---|---|
| GET | /api/doctors | - | All verified (paginated) |
| GET | /api/doctors/featured | - | Top 6 for home |
| GET | /api/doctors/stats | - | Platform stats |
| GET | /api/doctors/:id | - | Doctor details |
| POST | /api/doctors | Token | Register as doctor |
| GET | /api/doctors/my-profile | Doctor | Own profile |
| PATCH | /api/doctors/my-profile | Doctor | Update profile |
| GET | /api/doctors/admin/all | Admin | All doctors |
| PATCH | /api/doctors/:id/verify | Admin | Verify/reject |

### Appointments, Payments, Reviews, Prescriptions
See `routes/` folder for full endpoint list.

## Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```
Set all env variables in Vercel dashboard.
