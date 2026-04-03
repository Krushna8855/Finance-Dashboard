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

// Function to meticulously clean the private key string from common env-var formatting issues
function cleanPrivateKey(key) {
  if (!key) return undefined;
  let formattedKey = key.trim();
  
  // 1. Remove outer quotes if they exist (common in Render/Vercel settings)
  if (formattedKey.startsWith('"') && formattedKey.endsWith('"')) {
    formattedKey = formattedKey.slice(1, -1);
  }
  if (formattedKey.startsWith("'") && formattedKey.endsWith("'")) {
    formattedKey = formattedKey.slice(1, -1);
  }

  // 2. Handle literal \n strings (backslash + n) and convert them to real newlines
  formattedKey = formattedKey.replace(/\\n/g, '\n');

  // 3. Ensure the PEM format headers/footers are clean and standard
  // Sometimes multiple newlines are appended, we want a clean single newline structure
  formattedKey = formattedKey.trim();
  
  // PEM must end with a newline for some cert parsers
  if (!formattedKey.endsWith('\n')) {
    formattedKey += '\n';
  }
  
  return formattedKey;
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
const privateKey = envPrivateKey || serviceAccount?.private_key

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
    firebaseSetupError = `FAILED_TO_INITIALIZE: ${error.message} (Key Length: ${privateKey?.length || 0})`
  }
} else {
  firebaseSetupError =
    'Firestore is not configured. Add Firebase environment variables or set FIREBASE_SERVICE_ACCOUNT_PATH to your service account JSON file.'
}

export { admin, auth, db, hasFirebaseConfig, firebaseConfigSource, firebaseSetupError }
