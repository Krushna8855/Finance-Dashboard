/**
 * ⚠️ BACKEND DISABLED ⚠️
 * The frontend has been converted to STANDALONE mode and does not require this backend server.
 * All data is now managed locally within the browser's state and localStorage.
 */

import dotenv from 'dotenv'
import app from './app.js'
// ... rest of code

dotenv.config()

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})