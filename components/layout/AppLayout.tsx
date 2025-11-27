'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import Sidebar from './Sidebar'
import Header from './Header'

interface AppLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
  onSearchClick?: () => void
}

export default function AppLayout({ 
  children, 
  showSidebar = true,
  onSearchClick 
}: AppLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      {showSidebar && <Sidebar />}

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          showSidebar && (sidebarCollapsed ? 'ml-16' : 'ml-64')
        )}
      >
        <Header onSearchClick={onSearchClick} />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

