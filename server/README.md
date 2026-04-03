# Finance Dashboard Backend

A simple and beginner-friendly backend built with **Express** and **Firestore** for your `finance-dashboard` frontend.

---

## What this backend does

This backend gives your frontend real API routes instead of only using local browser storage.

It supports:

- `GET /api/health`
- `GET /api/transactions`
- `POST /api/transactions`
- `PUT /api/transactions/:id`
- `DELETE /api/transactions/:id`
- `POST /api/transactions/seed`

Every transaction uses this same shape:

```js
{
  id: 1,
  desc: 'Monthly Salary',
  amount: 5500,
  date: '2025-06-01',
  category: 'Salary',
  type: 'income'
}
```

---

## Tech used

- Express
- Firestore with `firebase-admin`
- dotenv
- cors
- nodemon

---

## Folder structure

```text
server
├─ src
│  ├─ config
│  │  └─ firebase.js
│  ├─ controllers
│  │  └─ transactionController.js
│  ├─ data
│  │  └─ seedTransactions.js
│  ├─ routes
│  │  └─ transactionRoutes.js
│  ├─ app.js
│  └─ server.js
├─ .env.example
├─ package.json
└─ README.md
```

---

# Full Firestore integration guide

## Step 1: Install backend packages

Open terminal inside the `server` folder and run:

```bash
npm install
```

This installs:
- Express
- Firebase Admin SDK
- CORS
- dotenv
- nodemon

---

## Step 2: Create a Firebase project

1. Open: `https://console.firebase.google.com`
2. Click **Create a project**
3. Give your project a name
4. Continue the setup
5. When the project is created, open it

---

## Step 3: Enable Firestore Database

1. In the Firebase project sidebar, click **Firestore Database**
2. Click **Create database**
3. Choose **Start in production mode** or **test mode**
   - for learning, test mode is easier
   - for real apps, production mode is better
4. Choose a location close to you
5. Click **Enable**

After this, your Firestore database is ready.

---

## Step 4: Create a service account

This backend uses **Firebase Admin SDK**, so you need a service account.

1. Open your Firebase project
2. Click the gear icon near **Project Overview**
3. Click **Project settings**
4. Open the **Service accounts** tab
5. Click **Generate new private key**
6. Download the JSON file

This JSON file contains values like:
- `project_id`
- `client_email`
- `private_key`

You will copy those values into your `.env` file.

---

## Step 5: Create `.env` file

Inside the `server` folder, copy `.env.example` to `.env`.

On Windows CMD:

```bash
copy .env.example .env
```

On PowerShell:

```powershell
Copy-Item .env.example .env
```

Now open `.env` and fill it like this:

```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-abc12@your-project-id.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
```

---

## Step 6: How to paste the private key correctly

This is the part where beginners usually make mistakes.

In the downloaded Firebase JSON file, the private key looks like this:

```json
"private_key": "-----BEGIN PRIVATE KEY-----\nABC123...\nXYZ456...\n-----END PRIVATE KEY-----\n"
```

Copy that full value into your `.env` as:

```env
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nABC123...\nXYZ456...\n-----END PRIVATE KEY-----\n"
```

### Important rules

- keep the double quotes
- keep every `\n`
- do not press Enter inside the key
- paste it as one single line in `.env`

If this is wrong, Firebase will not connect.

---

## Step 7: Run the backend

Start the backend:

```bash
npm run dev
```

If successful, your server should run at:

```text
http://localhost:5000
```

Your API base URL will be:

```text
http://localhost:5000/api
```

---

## Step 8: Check if Express server is working

Open this in your browser:

```text
http://localhost:5000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Server is running",
  "firestoreReady": true
}
```

If `firestoreReady` is `false`, Express is working but Firebase is not configured correctly yet.

---

## Step 9: Seed Firestore with demo data

After Firebase is connected, you can insert demo transactions.

Send a POST request to:

```text
http://localhost:5000/api/transactions/seed
```

This will add the sample finance transactions into Firestore.

---

# How the frontend connects

Your frontend file:

```text
finance-dashboard/src/context/AppContext.jsx
```

was updated to use this backend URL:

```js
const API_BASE_URL = 'http://localhost:5000/api'
```

The frontend now:
- loads transactions from the backend
- creates new transactions using POST
- updates transactions using PUT
- deletes transactions using DELETE

If the backend is not ready yet, it falls back to demo data so the UI still works.

---

# Full API testing guide

You can test the API in 3 easy ways:
1. browser
2. Postman
3. terminal using `curl`

---

## 1. Test `GET /api/health`

### Browser
Open:

```text
http://localhost:5000/api/health
```

### curl
```bash
curl http://localhost:5000/api/health
```

### Success response
```json
{
  "success": true,
  "message": "Server is running",
  "firestoreReady": true
}
```

---

## 2. Test `GET /api/transactions`

### Browser
Open:

```text
http://localhost:5000/api/transactions
```

### curl
```bash
curl http://localhost:5000/api/transactions
```

### Expected response
```json
{
  "success": true,
  "transactions": []
}
```

If you already seeded data, the array will contain transaction objects.

---

## 3. Test `POST /api/transactions`

### Postman
- Method: `POST`
- URL: `http://localhost:5000/api/transactions`
- Body type: `raw`
- JSON:

```json
{
  "desc": "Tea Shop",
  "amount": 50,
  "date": "2026-04-02",
  "category": "Food",
  "type": "expense"
}
```

### curl
```bash
curl -X POST http://localhost:5000/api/transactions -H "Content-Type: application/json" -d "{\"desc\":\"Tea Shop\",\"amount\":50,\"date\":\"2026-04-02\",\"category\":\"Food\",\"type\":\"expense\"}"
```

### Expected response
```json
{
  "success": true,
  "message": "Transaction created successfully.",
  "transaction": {
    "id": 1712060000000,
    "desc": "Tea Shop",
    "amount": 50,
    "date": "2026-04-02",
    "category": "Food",
    "type": "expense"
  }
}
```

---

## 4. Test `PUT /api/transactions/:id`

Replace `YOUR_ID` with a real transaction id.

### Postman
- Method: `PUT`
- URL: `http://localhost:5000/api/transactions/YOUR_ID`
- Body JSON:

```json
{
  "desc": "Tea Shop Updated",
  "amount": 80,
  "date": "2026-04-02",
  "category": "Food",
  "type": "expense"
}
```

### curl
```bash
curl -X PUT http://localhost:5000/api/transactions/YOUR_ID -H "Content-Type: application/json" -d "{\"desc\":\"Tea Shop Updated\",\"amount\":80,\"date\":\"2026-04-02\",\"category\":\"Food\",\"type\":\"expense\"}"
```

---

## 5. Test `DELETE /api/transactions/:id`

Replace `YOUR_ID` with a real transaction id.

### Postman
- Method: `DELETE`
- URL: `http://localhost:5000/api/transactions/YOUR_ID`

### curl
```bash
curl -X DELETE http://localhost:5000/api/transactions/YOUR_ID
```

### Expected response
```json
{
  "success": true,
  "message": "Transaction deleted successfully."
}
```

---

## 6. Test `POST /api/transactions/seed`

### Postman
- Method: `POST`
- URL: `http://localhost:5000/api/transactions/seed`

### curl
```bash
curl -X POST http://localhost:5000/api/transactions/seed
```

### Expected response
This route inserts starter transactions into Firestore.

---

# Example test order for beginners

Use this order:

1. Run backend
2. Test `/api/health`
3. Test `/api/transactions`
4. Test `/api/transactions/seed`
5. Test `/api/transactions` again
6. Create a new transaction with POST
7. Update it with PUT
8. Delete it with DELETE
9. Run the frontend and confirm the UI loads backend data

---

# Common errors and fixes

## Problem: `firestoreReady` is false

### Reason
Your Firebase env values are missing or wrong.

### Fix
Check:
- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

---

## Problem: private key error

### Reason
The private key was pasted incorrectly.

### Fix
- keep the whole key in double quotes
- keep all `\n`
- keep it on one line

---

## Problem: CORS error in frontend

### Reason
Backend may not be running on port `5000`.

### Fix
- start backend with `npm run dev`
- confirm `http://localhost:5000/api/health` works

---

## Problem: frontend still shows old demo data

### Reason
Backend request failed, so fallback data is being used.

### Fix
- make sure backend is running
- make sure Firestore is connected
- open browser devtools and check console errors

---

## Problem: route returns setup error

### Example
```json
{
  "success": false,
  "message": "Firestore is not configured. Please add Firebase environment variables in server/.env."
}
```

### Fix
Complete the `.env` file correctly.

---

# Safe beginner behavior included

This backend was made beginner-friendly.

If Firebase is not configured:
- server still starts
- `/api/health` still works
- transaction routes return friendly error JSON
- app does not crash immediately

This helps you first confirm Express is working before fixing Firebase.

---

# Final run steps

## Backend
Inside `server`:

```bash
npm install
copy .env.example .env
npm run dev
```

## Frontend
Inside `finance-dashboard`:

```bash
npm install
npm run dev
```

---

# Final check

Backend:
```text
http://localhost:5000/api/health
```

Frontend:
```text
http://localhost:5173
```

If both are running correctly, your finance dashboard frontend should now work with the Express + Firestore backend.
