'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Building2, 
  TrendingUp, 
  MapPin, 
  BarChart3
} from 'lucide-react'
import AddCompanyForm from '@/components/Admin/AddCompanyForm'
import CompanyList from '@/components/Admin/CompanyList'
import { useStats } from '@/lib/hooks/useCompanies'

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false)
  const { data: stats, isLoading: loading } = useStats()

  return (
    <div className="min-h-screen bg-frameio-bg-secondary">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="frameio-bg-gradient border-b border-frameio-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <motion.h1 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-bold text-frameio-text-primary mb-2"
              >
                Admin Dashboard
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-frameio-text-secondary"
              >
                Verwalte Beratungsunternehmen und Spezialisierungen in Niedersachsen
              </motion.p>
            </div>

            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowForm(!showForm)}
              className="bg-frameio-primary hover:bg-frameio-primary-hover text-white font-semibold px-6 py-3 rounded-full shadow-lg transition-all flex items-center gap-2 self-start md:self-auto"
            >
              <Plus className="w-5 h-5" />
              Neues Unternehmen
            </motion.button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* STATS CARDS */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-6 -mt-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Companies */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-frameio-primary to-frameio-accent-purple flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-green-500 text-sm font-medium flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +12%
              </span>
            </div>
            <h3 className="text-3xl font-bold text-frameio-text-primary mb-1">
              {loading ? '...' : stats?.totalCompanies || 0}
            </h3>
            <p className="text-sm text-frameio-text-secondary">
              Registrierte Unternehmen
            </p>
          </motion.div>

          {/* Cities Count */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-frameio-text-primary mb-1">
              {loading ? '...' : Object.keys(stats?.citiesCount || {}).length}
            </h3>
            <p className="text-sm text-frameio-text-secondary">
              Abgedeckte Städte
            </p>
          </motion.div>

          {/* Specializations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-frameio-bg-primary border border-frameio-border rounded-2xl p-6 shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-pink-500 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-frameio-text-primary mb-1">
              {loading ? '...' : Object.keys(stats?.specializationsCount || {}).length}
            </h3>
            <p className="text-sm text-frameio-text-secondary">
              Spezialisierungen
            </p>
          </motion.div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        {/* Add Company Form (collapsible) */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8 overflow-hidden"
            >
              <AddCompanyForm 
                onSuccess={() => {
                  setShowForm(false)
                }} 
                onCancel={() => setShowForm(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Company List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <CompanyList />
        </motion.div>
      </div>
    </div>
  )
}
