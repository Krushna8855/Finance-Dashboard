import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import transactionRoutes from './routes/transactionRoutes.js';
import {
  db,
  firebaseConfigSource,
  firebaseSetupError,
  hasFirebaseConfig,
} from './config/firebase.js'

const app = express()

// Trust proxy for Render/Vercel (required for express-rate-limit)
app.set('trust proxy', 1)

// 1. CORS - MUST BE FIRST (before helmet, rate limiter, or any other response-sending middleware)
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,https://finance-dashboard-xi-blond.vercel.app')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow browser if no origin (like server-to-server or curl)
      if (!origin) return callback(null, true)

      // Allow if origin is in allowed list or if '*' is in list
      const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin)

      if (isAllowed) {
        callback(null, true)
      } else {
        callback(new Error('CORS_ERROR: Origin not allowed.'))
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    maxAge: 86400, // Cache preflight response for 24 hours
  })
)

// Handle preflight explicitly (optional but safe)
app.options('*', cors())

// 2. Security & Utilities
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginEmbedderPolicy: false,
}))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use(compression())
app.use(express.json({ limit: '10kb' }))

// 3. Rate Limiting (Production Only)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
})

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter)
}

// 4. Health Check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    firestoreReady: Boolean(db),
    firebaseConfigured: hasFirebaseConfig,
    firebaseConfigSource,
    authBypassEnabled: process.env.DEV_AUTH_BYPASS === 'true',
    allowedOrigins,
    ...(firebaseSetupError ? { firebaseSetupError } : {}),
  })
})

// 5. Routes
app.use('/api', transactionRoutes)

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('API Error:', err)

  if (err.message === 'CORS_ERROR: Origin not allowed.') {
    return res.status(403).json({
      success: false,
      message: 'CORS Blocked: This origin is not allowed to access the API.',
      hint: 'Configure CORS_ORIGIN on the server to include your frontend URL.',
    })
  }

  return res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error.',
  })
})

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  })
})

export default app
