import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import transactionRoutes from './routes/transactionRoutes.js'
import {
  db,
  firebaseConfigSource,
  firebaseSetupError,
  hasFirebaseConfig,
} from './config/firebase.js'

const app = express()

// Security Middleware
app.use(helmet())

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// Compression
app.use(compression())

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
})

if (process.env.NODE_ENV === 'production') {
  app.use('/api/', limiter)
}

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean)

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true)
      }

      return callback(new Error('CORS origin not allowed.'))
    },
    credentials: true,
  })
)

app.use(express.json({ limit: '10kb' })) // Hardened JSON limit

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

app.use('/api', transactionRoutes)

app.use((err, req, res, next) => {
  if (err.message === 'CORS origin not allowed.') {
    return res.status(403).json({
      success: false,
      message: err.message,
    })
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error.',
  })
})

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  })
})

export default app
