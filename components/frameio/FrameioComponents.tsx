'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

/* Frame.io Hero Section */
export function FrameioHero({ 
  title, 
  subtitle, 
  children 
}: { 
  title: string
  subtitle?: string
  children?: ReactNode
}) {
  return (
    <section className="frameio-section bg-[rgb(var(--frameio-bg-primary))]">
      <div className="frameio-section-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="text-center max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-[rgb(var(--frameio-text-primary))]">
            {title}
          </h1>
          
          {subtitle && (
            <p className="text-xl text-[rgb(var(--frameio-text-secondary))] 
                          max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
          
          {children && (
            <div className="flex flex-wrap gap-4 justify-center pt-4">
              {children}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}

/* Frame.io Feature Card */
export function FrameioFeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="frameio-card p-8 space-y-4"
    >
      <div className="w-12 h-12 rounded-[var(--frameio-radius-lg)] 
                      bg-[rgb(var(--frameio-bg-secondary))] 
                      flex items-center justify-center
                      text-[rgb(var(--frameio-primary))]">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold text-[rgb(var(--frameio-text-primary))]">
        {title}
      </h3>
      
      <p className="text-[rgb(var(--frameio-text-secondary))] leading-relaxed">
        {description}
      </p>
    </motion.div>
  )
}

/* Frame.io Stat Card */
export function FrameioStatCard({ 
  value, 
  label, 
  icon 
}: { 
  value: string | number
  label: string
  icon?: ReactNode
}) {
  return (
    <div className="frameio-card p-6 text-center space-y-3">
      {icon && (
        <div className="w-12 h-12 mx-auto rounded-[var(--frameio-radius-lg)] 
                        bg-[rgb(var(--frameio-primary)_/_0.1)] 
                        flex items-center justify-center
                        text-[rgb(var(--frameio-primary))]">
          {icon}
        </div>
      )}
      
      <div className="text-4xl font-bold text-[rgb(var(--frameio-text-primary))]">
        {value}
      </div>
      
      <div className="text-sm text-[rgb(var(--frameio-text-secondary))]">
        {label}
      </div>
    </div>
  )
}

/* Frame.io Navigation */
export function FrameioNavigation({ 
  items, 
  activeItem 
}: { 
  items: Array<{ label: string; href: string }>
  activeItem?: string
}) {
  return (
    <nav className="flex items-center gap-2">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className={
            item.label === activeItem 
              ? 'frameio-nav-item-active' 
              : 'frameio-nav-item'
          }
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}

/* Frame.io Container */
export function FrameioContainer({ children }: { children: ReactNode }) {
  return (
    <div className="frameio-section-content">
      {children}
    </div>
  )
}

/* Frame.io Grid */
export function FrameioGrid({ 
  children, 
  columns = 3 
}: { 
  children: ReactNode
  columns?: 2 | 3 | 4
}) {
  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }[columns]
  
  return (
    <div className={`grid ${gridClass} gap-6`}>
      {children}
    </div>
  )
}

/* Frame.io Button Group */
export function FrameioButtonGroup({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {children}
    </div>
  )
}

/* Frame.io Section Heading */
export function FrameioSectionHeading({ 
  title, 
  subtitle, 
  centered = false 
}: { 
  title: string
  subtitle?: string
  centered?: boolean
}) {
  return (
    <div className={`space-y-4 ${centered ? 'text-center mx-auto max-w-3xl' : ''}`}>
      <h2 className="text-[rgb(var(--frameio-text-primary))]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-lg text-[rgb(var(--frameio-text-secondary))] leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  )
}

