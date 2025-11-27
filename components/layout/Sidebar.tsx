'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Map, Building2, MapPin, Settings, ChevronLeft, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Karte', href: '/', icon: Map },
  { name: 'Unternehmen', href: '/companies', icon: Building2 },
  { name: 'Städte', href: '/cities', icon: MapPin },
  { name: 'Admin', href: '/admin', icon: Settings },
]

export default function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setCollapsed(JSON.parse(saved))
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !collapsed
    setCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
  }

  return (
    <aside
      className={cn(
        'bg-white border-r border-gray-200 shadow-lg fixed left-0 top-0 z-40 h-screen transition-all duration-300',
        collapsed ? 'w-16' : 'w-64',
        className
      )}
    >
      <div className="flex h-full flex-col">
        {/* Logo & Title */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Map className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">BeratungsMap</span>
            </div>
          )}
          {collapsed && (
            <div className="flex items-center justify-center w-full">
              <Map className="h-6 w-6 text-primary" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'sidebar-item',
                  isActive && 'sidebar-item-active',
                  collapsed && 'justify-center px-2'
                )}
                title={collapsed ? item.name : undefined}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            )
          })}
        </nav>

        <Separator className="my-2" />

        {/* Collapse Button */}
        <div className="p-3">
          <Button
            variant="ghost"
            size={collapsed ? 'icon' : 'default'}
            onClick={toggleCollapsed}
            className="w-full"
          >
            <ChevronLeft
              className={cn(
                'h-5 w-5 transition-transform',
                collapsed && 'rotate-180'
              )}
            />
            {!collapsed && <span className="ml-2">Einklappen</span>}
          </Button>
        </div>
      </div>
    </aside>
  )
}

