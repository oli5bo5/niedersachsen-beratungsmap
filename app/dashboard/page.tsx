import { Building2, MapPin, Euro, TrendingUp } from 'lucide-react'
import { getCompanies, getSpecializations } from '@/app/actions/companies'
import { getCities } from '@/app/actions/cities'
import StatsCard from '@/components/dashboard/StatsCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export default async function DashboardPage() {
  const [companies, specializations, cities] = await Promise.all([
    getCompanies(),
    getSpecializations(),
    getCities(),
  ])

  // Calculate stats
  const avgBudget = cities.length > 0
    ? cities.reduce((sum, city) => sum + city.digitalization_budget, 0) / cities.length
    : 0

  // Find most common specialization
  const specCounts = new Map<string, number>()
  companies.forEach((company) => {
    company.specializations?.forEach((spec) => {
      specCounts.set(spec.id, (specCounts.get(spec.id) || 0) + 1)
    })
  })
  const topSpecId = Array.from(specCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topSpec = specializations.find((s) => s.id === topSpecId)

  // Specialization distribution
  const specDistribution = specializations.map((spec) => ({
    name: spec.name,
    value: specCounts.get(spec.id) || 0,
    color: spec.color,
    icon: spec.icon,
  }))

  // City categories
  const cityCategories = [
    { name: 'Großstadt', value: cities.filter((c) => c.city_category === 'Großstadt').length, color: '#EF4444' },
    { name: 'Mittelstadt', value: cities.filter((c) => c.city_category === 'Mittelstadt').length, color: '#F59E0B' },
    { name: 'Kleinstadt', value: cities.filter((c) => c.city_category === 'Kleinstadt').length, color: '#10B981' },
  ]

  // Recent companies (last 10)
  const recentCompanies = [...companies]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 10)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht über die Beratungslandschaft in Niedersachsen
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Gesamt Unternehmen"
          value={companies.length}
          description="Beratungsunternehmen"
          icon={Building2}
          trend={{ value: 12, label: 'vs letzter Monat' }}
        />
        <StatsCard
          title="Gesamt Städte"
          value={cities.length}
          description="In Niedersachsen"
          icon={MapPin}
          trend={{ value: 5, label: 'neue Städte' }}
        />
        <StatsCard
          title="Ø Digitalbudget"
          value={new Intl.NumberFormat('de-DE', {
            style: 'currency',
            currency: 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          }).format(avgBudget)}
          description="Pro Stadt"
          icon={Euro}
        />
        <StatsCard
          title="Top Spezialisierung"
          value={topSpec ? `${topSpec.icon} ${topSpec.name}` : 'N/A'}
          description={`${specCounts.get(topSpecId || '') || 0} Unternehmen`}
          icon={TrendingUp}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Specialization Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Spezialisierungen</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {specDistribution
                .filter((spec) => spec.value > 0)
                .sort((a, b) => b.value - a.value)
                .map((spec) => (
                  <div key={spec.name} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span>{spec.icon}</span>
                        <span>{spec.name}</span>
                      </span>
                      <span className="font-semibold">{spec.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(spec.value / companies.length) * 100}%`,
                          backgroundColor: spec.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* City Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Stadt-Kategorien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {cityCategories.map((category) => (
                <div key={category.name} className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>{category.name}</span>
                    <span className="font-semibold">{category.value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(category.value / cities.length) * 100}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Companies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Neueste Unternehmen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentCompanies.map((company) => (
              <div
                key={company.id}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{company.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {company.city || 'Keine Stadt'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {company.specializations?.slice(0, 2).map((spec) => (
                    <span
                      key={spec.id}
                      className="text-lg"
                      title={spec.name}
                    >
                      {spec.icon}
                    </span>
                  ))}
                  {(company.specializations?.length || 0) > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{(company.specializations?.length || 0) - 2}
                    </span>
                  )}
                </div>
                <div className="text-xs text-muted-foreground ml-4">
                  {new Date(company.created_at).toLocaleDateString('de-DE')}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}



