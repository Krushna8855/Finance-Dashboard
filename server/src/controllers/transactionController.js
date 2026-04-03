import { db, firebaseSetupError } from '../config/firebase.js'
import seedTransactions from '../data/seedTransactions.js'

const collectionName = 'transactions'

function sendFirestoreSetupError(res) {
  return res.status(500).json({
    success: false,
    message:
      firebaseSetupError ||
      'Firestore is not configured. Please add Firebase environment variables in server/.env.',
  })
}

function isValidTransaction(data) {
  if (!data) {
    return false
  }

  const description = data.desc ?? data.title ?? data.description
  const category = data.category ?? 'General'
  const amount = Number(data.amount)

  const hasTextFields =
    typeof description === 'string' &&
    description.trim().length > 0 &&
    typeof data.date === 'string' &&
    data.date.trim().length > 0 &&
    typeof category === 'string' &&
    category.trim().length > 0 &&
    typeof data.type === 'string'

  const hasValidAmount = Number.isFinite(amount)
  const hasValidType = data.type === 'income' || data.type === 'expense'

  return hasTextFields && hasValidAmount && hasValidType
}

function normalizeTransaction(data, idFromParams) {
  const resolvedId = idFromParams ?? data.id ?? `${Date.now()}`
  const desc = data.desc ?? data.title ?? data.description

  return {
    id: resolvedId,
    desc,
    title: desc,
    amount: Number(data.amount),
    date: data.date,
    category: data.category ?? 'General',
    type: data.type,
  }
}

function transformStoredTransaction(data, fallbackId) {
  return normalizeTransaction(
    {
      ...data,
      id: data?.id ?? fallbackId,
    },
    data?.id ?? fallbackId
  )
}

export async function getTransactions(req, res) {
  if (!db) {
    return sendFirestoreSetupError(res)
  }

  try {
    const snapshot = await db.collection(collectionName).get()

    const transactions = snapshot.docs.map((doc) =>
      transformStoredTransaction(doc.data(), doc.id)
    )

    transactions.sort((a, b) => {
      if (a.date === b.date) {
        return Number(b.id) - Number(a.id)
      }

      return b.date.localeCompare(a.date)
    })

    return res.json({
      success: true,
      data: transactions,
      transactions,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not fetch transactions.',
      error: error.message,
    })
  }
}

export async function createTransaction(req, res) {
  if (!db) {
    return sendFirestoreSetupError(res)
  }

  try {
    const rawData = req.body

    if (!isValidTransaction(rawData)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid transaction data. Required fields: desc, amount, date, category, type. Type must be income or expense.',
      })
    }

    const customId =
      rawData.id !== undefined && rawData.id !== null && rawData.id !== ''
        ? rawData.id
        : Date.now()

    const transaction = normalizeTransaction(rawData, customId)

    await db.collection(collectionName).doc(String(transaction.id)).set(transaction)

    return res.status(201).json({
      success: true,
      message: 'Transaction created successfully.',
      data: transaction,
      transaction,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not create transaction.',
      error: error.message,
    })
  }
}

export async function updateTransaction(req, res) {
  if (!db) {
    return sendFirestoreSetupError(res)
  }

  try {
    const { id } = req.params
    const docRef = db.collection(collectionName).doc(String(id))
    const existingDoc = await docRef.get()

    if (!existingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      })
    }

    const rawData = req.body

    if (!isValidTransaction(rawData)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid transaction data. Required fields: desc, amount, date, category, type. Type must be income or expense.',
      })
    }

    const transaction = normalizeTransaction(rawData, id)

    await docRef.set(transaction)

    return res.json({
      success: true,
      message: 'Transaction updated successfully.',
      data: transaction,
      transaction,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not update transaction.',
      error: error.message,
    })
  }
}

export async function deleteTransaction(req, res) {
  if (!db) {
    return sendFirestoreSetupError(res)
  }

  try {
    const { id } = req.params
    const docRef = db.collection(collectionName).doc(String(id))
    const existingDoc = await docRef.get()

    if (!existingDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found.',
      })
    }

    await docRef.delete()

    return res.json({
      success: true,
      message: 'Transaction deleted successfully.',
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not delete transaction.',
      error: error.message,
    })
  }
}

export async function seedTransactionsToFirestore(req, res) {
  if (!db) {
    return sendFirestoreSetupError(res)
  }

  try {
    const batch = db.batch()

    seedTransactions.forEach((transaction) => {
      const docRef = db.collection(collectionName).doc(String(transaction.id))
      batch.set(docRef, transaction)
    })

    await batch.commit()

    return res.json({
      success: true,
      message: 'Seed data added successfully.',
      count: seedTransactions.length,
      data: seedTransactions,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Could not seed transactions.',
      error: error.message,
    })
  }
}
