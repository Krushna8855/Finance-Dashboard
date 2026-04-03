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
      // 1. Allow if no origin (like server-to-server, curls, or dev apps)
      if (!origin) return callback(null, true)

      // 2. Allow if origin matches exactly or if '*' is in list
      const isAllowed = allowedOrigins.includes('*') || allowedOrigins.includes(origin)

      // 3. Robust subdomain allowance: Allow any Vercel preview/deployment or Localhost
      const isVercel = origin.endsWith('.vercel.app')
      const isLocal = origin.includes('localhost') || origin.includes('127.0.0.1')

      if (isAllowed || isVercel || isLocal) {
        callback(null, true)
      } else {
        console.warn(`[CORS REJECTED] Origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`)
        callback(new Error('CORS_ERROR: This origin is not allowed to access the API.'))
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
    message: 'Server is running (Logic Update v2.2: Flexible CORS & Root Routes enabled)',
    firestoreReady: Boolean(db),
    firebaseConfigured: hasFirebaseConfig,
    firebaseConfigSource,
    authBypassEnabled: process.env.DEV_AUTH_BYPASS === 'true',
    allowedOrigins,
    ...(firebaseSetupError ? { firebaseSetupError } : {}),
  })
})

// 5. Routes
app.use('/api', transactionRoutes) // Standard route with prefix
app.use(transactionRoutes)      // Fallback: allows requests without /api prefix for convenience

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
