import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import admin from 'firebase-admin'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '../..')

const envProjectId = process.env.FIREBASE_PROJECT_ID
const envClientEmail = process.env.FIREBASE_CLIENT_EMAIL

/**
 * Mega-robust Private Key Cleaner
 * Extracts the PEM key using markers and handles all common env-var corruption.
 */
function cleanPrivateKey(key) {
  if (!key) return undefined;

  // 1. Convert any escaped newlines to actual newlines
  let processed = key.replace(/\\n/g, '\n');

  // 2. Remove any carriage returns (\r) which can corrupt DER parsing
  processed = processed.replace(/\r/g, '');

  // 3. Extra safety: try to find the actual PEM delimiters
  const startMarker = '-----BEGIN PRIVATE KEY-----';
  const endMarker = '-----END PRIVATE KEY-----';
  
  const startIndex = processed.indexOf(startMarker);
  const endIndex = processed.indexOf(endMarker);
  
  if (startIndex !== -1 && endIndex !== -1) {
    processed = processed.substring(startIndex, endIndex + endMarker.length);
  } else {
    // Fallback: Just remove common outer junk
    processed = processed.trim().replace(/^["']|["']$/g, '');
  }

  // 4. Final standard cleanup (trim and ensure single trailing newline)
  return processed.trim() + '\n';
}

const envPrivateKey = cleanPrivateKey(process.env.FIREBASE_PRIVATE_KEY);

const firebaseServiceAccountPath =
  process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
  path.join(projectRoot, 'finance-dashboard-cc996-firebase-adminsdk-fbsvc-6745b1c8cb.json')

function readServiceAccountFile(serviceAccountPath) {
  if (!serviceAccountPath) {
    return null
  }

  const resolvedPath = path.isAbsolute(serviceAccountPath)
    ? serviceAccountPath
    : path.resolve(projectRoot, serviceAccountPath)

  if (!fs.existsSync(resolvedPath)) {
    return null
  }

  const rawFile = fs.readFileSync(resolvedPath, 'utf8')
  const parsedFile = JSON.parse(rawFile)

  return {
    serviceAccount: parsedFile,
    resolvedPath,
  }
}

let serviceAccountFromFile = null

try {
  serviceAccountFromFile = readServiceAccountFile(firebaseServiceAccountPath)
} catch (error) {
  serviceAccountFromFile = null
}

const serviceAccount = serviceAccountFromFile?.serviceAccount
const projectId = envProjectId || serviceAccount?.project_id
const clientEmail = envClientEmail || serviceAccount?.client_email
const rawPrivateKey = envPrivateKey || serviceAccount?.private_key
const privateKey = cleanPrivateKey(rawPrivateKey)

const hasFirebaseConfig = Boolean(projectId && clientEmail && privateKey)

let db = null
let auth = null
let firebaseSetupError = null
let firebaseConfigSource = 'missing'

if (hasFirebaseConfig) {
  try {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      })
    }

    db = admin.firestore()
    auth = admin.auth()
    firebaseConfigSource = serviceAccountFromFile ? 'service-account-file' : 'environment'
  } catch (error) {
    firebaseSetupError = `FAILED_TO_INITIALIZE: ${error.message} (Cleaned Key Length: ${privateKey?.length || 0}) Header: [${privateKey?.substring(0, 50)}...]`
  }
} else {
  firebaseSetupError =
    'Firestore is not configured. Add Firebase environment variables or set FIREBASE_SERVICE_ACCOUNT_PATH to your service account JSON file.'
}

export { admin, auth, db, hasFirebaseConfig, firebaseConfigSource, firebaseSetupError }
