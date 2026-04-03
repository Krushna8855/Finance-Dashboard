import { Router } from 'express'
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  seedTransactionsToFirestore,
  updateTransaction,
} from '../controllers/transactionController.js'
import { verifyFirebaseToken } from '../middleware/authMiddleware.js'

const router = Router()

router.use(verifyFirebaseToken)

router.get('/transactions', getTransactions)
router.post('/transactions', createTransaction)
router.put('/transactions/:id', updateTransaction)
router.delete('/transactions/:id', deleteTransaction)
router.post('/transactions/seed', seedTransactionsToFirestore)

export default router
