import { auth, firebaseSetupError } from '../config/firebase.js'

export async function verifyFirebaseToken(req, res, next) {
  const authorizationHeader = req.headers.authorization || ''
  const allowBypass =
    process.env.DEV_AUTH_BYPASS === 'true' ||
    (!process.env.DEV_AUTH_BYPASS && process.env.NODE_ENV !== 'production')

  if (!authorizationHeader.startsWith('Bearer ')) {
    if (allowBypass) {
      req.user = { uid: 'dev-user', role: 'admin', bypassAuth: true }
      return next()
    }

    return res.status(401).json({
      success: false,
      message: 'Authorization token is required.',
    })
  }

  if (!auth) {
    if (allowBypass) {
      req.user = { uid: 'dev-user', role: 'admin', bypassAuth: true }
      return next()
    }

    return res.status(500).json({
      success: false,
      message:
        firebaseSetupError ||
        'Firebase authentication is not configured on the server.',
    })
  }

  const token = authorizationHeader.slice('Bearer '.length).trim()

  if (!token) {
    if (allowBypass) {
      req.user = { uid: 'dev-user', role: 'admin', bypassAuth: true }
      return next()
    }

    return res.status(401).json({
      success: false,
      message: 'Authorization token is required.',
    })
  }

  try {
    const decodedToken = await auth.verifyIdToken(token)
    req.user = decodedToken
    return next()
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authorization token.',
      error: error.message,
    })
  }
}
