import { Activity } from 'lucide-react'
import { useMemo, useState } from 'react'
import TransactionTable from '../components/transactions/TransactionTable'
import FilterBar from '../components/transactions/FilterBar'
import AddTransactionModal from '../components/transactions/AddTransactionModal'
import DeleteConfirmationModal from '../components/transactions/DeleteConfirmationModal'
import { useApp } from '../context/AppContext'
import { fmt } from '../utils/calculations'
import Hyperspeed from '../components/common/Hyperspeed'
import PixelSnow from '../components/common/PixelSnow'
import BorderGlow from '../components/common/BorderGlow'

export default function Transactions() {
  const { transactions, filters, role, deleteTransaction } = useApp()

  const hyperspeedOptions = {
    distortion: 'LongRaceDistortion',
    length: 300,
    roadWidth: 10,
    islandWidth: 5,
    lanesPerRoad: 2,
    fov: 90,
    fovSpeedUp: 150,
    speedUp: 2,
    carLightsFade: 0.4,
    totalSideLightSticks: 20,
    lightPairsPerRoadWay: 40,
    shoulderLinesWidthPercentage: 0.05,
    brokenLinesWidthPercentage: 0.1,
    brokenLinesLengthPercentage: 0.5,
    lightStickWidth: [0.12, 0.5],
    lightStickHeight: [1.3, 1.7],
    movingAwaySpeed: [60, 80],
    movingCloserSpeed: [-120, -160],
    carLightsLength: [300 * 0.05, 300 * 0.15],
    carLightsRadius: [0.05, 0.14],
    carWidthPercentage: [0.3, 0.5],
    carShiftX: [-0.2, 0.2],
    carFloorSeparation: [0.05, 1],
    colors: {
      roadColor: 0x080808,
      islandColor: 0x0a0a0a,
      background: 0x000000,
      shoulderLines: 0x131318,
      brokenLines: 0x131318,
      leftCars: [0xff5f73, 0xe11d48, 0xbe123c],
      rightCars: [0x38bdf8, 0x0ea5e9, 0x0284c7],
      sticks: 0xff5f73
    }
  }

  const [modalOpen, setModalOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [txToDelete, setTxToDelete] = useState(null)

  const filtered = useMemo(() => {
    return transactions
      .filter((tx) => {
        const search = filters.search.trim().toLowerCase()
        if (
          search &&
          !`${tx.desc} ${tx.category} ${tx.type}`.toLowerCase().includes(search)
        ) {
          return false
        }

        if (filters.type !== '' && tx.type !== filters.type) return false
        if (filters.category !== '' && tx.category !== filters.category) return false
        return true
      })
      .sort((a, b) => {
        if (filters.sort === 'date-desc') return new Date(b.date) - new Date(a.date)
        if (filters.sort === 'date-asc') return new Date(a.date) - new Date(b.date)
        if (filters.sort === 'amount-desc') return b.amount - a.amount
        if (filters.sort === 'amount-asc') return a.amount - b.amount
        return 0
      })
  }, [transactions, filters])

  const incomeCount = filtered.filter((tx) => tx.type === 'income').length
  const expenseCount = filtered.filter((tx) => tx.type === 'expense').length
  const totalVolume = filtered.reduce((sum, tx) => sum + tx.amount, 0)

  const openAdd = () => {
    setEditData(null)
    setModalOpen(true)
  }

  const openEdit = (tx) => {
    setEditData(tx)
    setModalOpen(true)
  }

  const handleDeleteClick = (tx) => {
    setTxToDelete(tx)
    setDeleteModalOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (txToDelete) {
      await deleteTransaction(txToDelete.id)
      setDeleteModalOpen(false)
      setModalOpen(false)
    }
  }

  return (
    <div className="space-y-6 lg:space-y-10">
      <section className="relative overflow-hidden rounded-[3rem] bg-slate-950 px-8 py-10 text-white shadow-2xl">
        <div className="absolute inset-0 z-0 opacity-40">
          <Hyperspeed effectOptions={hyperspeedOptions} />
        </div>

        {/* PixelSnow Side Animation */}
        <div className="absolute left-0 top-0 z-10 h-full w-1/3 opacity-15 pointer-events-none">
          <PixelSnow
            color="#3b82f6"
            flakeSize={0.005}
            minFlakeSize={1}
            pixelResolution={120}
            speed={0.8}
            density={0.15}
            direction={125}
            brightness={0.8}
            depthFade={10}
            farPlane={25}
            gamma={0.5}
            variant="snowflake"
          />
        </div>

        <div className="absolute inset-0 z-10 bg-gradient-to-br from-slate-900/40 to-slate-950/90" />

        <div className="relative z-20 flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-blue-400">
              <Activity size={12} className="fill-current" />
              <span>Transaction Workspace</span>
            </div>
            <h1 className="mt-4 text-4xl font-black tracking-tighter sm:text-5xl">
              Audit and refine <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">every entry.</span>
            </h1>
            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-400 sm:text-base opacity-70">
              Institutional-grade ledger management. Search, pivot, and verify liquidity in real-time.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-xl border border-white/5 bg-white/10 px-5 py-2 backdrop-blur-xl shadow-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Live Volume</p>
                <p className="mt-0.5 text-lg font-black text-white leading-none">{fmt(totalVolume)}</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-white/10 px-5 py-2 backdrop-blur-xl shadow-xl">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">Records</p>
                <p className="mt-0.5 text-lg font-black text-blue-400 leading-none">{filtered.length}</p>
              </div>
            </div>
          </div>

          <div className="lg:w-1/4">
            <button
              onClick={openAdd}
              disabled={role !== 'admin'}
              className="flex w-full items-center justify-center gap-3 rounded-[2rem] bg-white px-8 py-5 text-sm font-black uppercase tracking-widest text-slate-950 shadow-2xl transition-all hover:scale-[1.05] hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
            >
              {role === 'admin' ? (
                <>
                  <Activity size={18} />
                  New Record
                </>
              ) : 'Admin Only'}
            </button>
          </div>
        </div>
      </section>

      <BorderGlow borderRadius={32} glowRadius={60} glowColor="217 91 60" colors={['#3b82f6', '#1d4ed8', '#1e40af']} backgroundColor="rgba(15, 23, 42, 0.4)">
        <section className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="section-title">Transaction Explorer</h2>
              <p className="section-copy">Search by description, filter by type/category, and sort by date or amount.</p>
            </div>
          </div>

          <FilterBar />
          <TransactionTable transactions={filtered} onEdit={openEdit} onDelete={handleDeleteClick} />
        </section>
      </BorderGlow>

      <AddTransactionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
        onDelete={() => handleDeleteClick(editData)}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        transactionTitle={txToDelete?.desc}
      />
    </div>
  )
}
