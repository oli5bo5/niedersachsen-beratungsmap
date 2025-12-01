'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Building2, MapPin, Home, Map as MapIcon, Settings } from 'lucide-react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'
import type { City } from '@/lib/types/city'

interface CommandMenuProps {
  companies: CompanyWithSpecializations[]
  cities: City[]
  onSelectCompany?: (companyId: string) => void
  onSelectCity?: (cityId: string) => void
}

export default function CommandMenu({
  companies,
  cities,
  onSelectCompany,
  onSelectCity,
}: CommandMenuProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const runCommand = (command: () => void) => {
    setOpen(false)
    command()
  }

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Suche nach Unternehmen, Städten oder Navigation..." />
      <CommandList>
        <CommandEmpty>Keine Ergebnisse gefunden.</CommandEmpty>

        {/* Navigation */}
        <CommandGroup heading="Navigation">
          <CommandItem
            onSelect={() => runCommand(() => router.push('/dashboard'))}
          >
            <Home className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/'))}
          >
            <MapIcon className="mr-2 h-4 w-4" />
            <span>Karte</span>
          </CommandItem>
          <CommandItem
            onSelect={() => runCommand(() => router.push('/admin'))}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Admin</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Companies */}
        <CommandGroup heading="Unternehmen">
          {companies.slice(0, 8).map((company) => (
            <CommandItem
              key={company.id}
              value={`${company.name} ${company.city}`}
              onSelect={() =>
                runCommand(() => {
                  if (onSelectCompany) {
                    onSelectCompany(company.id)
                  } else {
                    router.push(`/?company=${company.id}`)
                  }
                })
              }
            >
              <Building2 className="mr-2 h-4 w-4" />
              <div className="flex items-center gap-2">
                <span>{company.name}</span>
                {company.city && (
                  <span className="text-xs text-muted-foreground">
                    • {company.city}
                  </span>
                )}
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Cities */}
        <CommandGroup heading="Städte">
          {cities.slice(0, 8).map((city) => (
            <CommandItem
              key={city.id}
              value={`${city.name} ${city.city_category}`}
              onSelect={() =>
                runCommand(() => {
                  if (onSelectCity) {
                    onSelectCity(city.id)
                  } else {
                    router.push(`/?city=${city.id}`)
                  }
                })
              }
            >
              <MapPin className="mr-2 h-4 w-4" />
              <div className="flex items-center gap-2">
                <span>{city.name}</span>
                <span className="text-xs text-muted-foreground">
                  • {city.city_category}
                </span>
              </div>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}



