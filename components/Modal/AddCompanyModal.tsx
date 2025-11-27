'use client'

import AddCompanyForm from '@/components/Admin/AddCompanyForm'
import type { Specialization } from '@/lib/supabase/types'

interface AddCompanyModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  specializations: Specialization[]
}

export default function AddCompanyModal({
  isOpen,
  onClose,
  onSuccess,
  specializations,
}: AddCompanyModalProps) {
  if (!isOpen) return null

  const handleSuccess = () => {
    onSuccess?.()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10 rounded-t-xl">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <span>🏢</span>
            Neues Beratungsunternehmen hinzufügen
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="p-6">
          <AddCompanyForm
            specializations={specializations}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    </div>
  )
}

