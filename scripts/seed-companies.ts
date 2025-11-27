import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Fehler: NEXT_PUBLIC_SUPABASE_URL und NEXT_PUBLIC_SUPABASE_ANON_KEY müssen gesetzt sein')
  console.error('Erstellen Sie eine .env.local Datei mit diesen Variablen')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const exampleCompanies = [
  {
    name: 'Digital Pioneers Hannover',
    city: 'Hannover',
    address: 'Vahrenwalder Str. 7, 30165 Hannover',
    latitude: 52.3759,
    longitude: 9.7320,
    description:
      'Führendes Beratungsunternehmen für digitale Transformation und KI-Integration im Mittelstand. Spezialisiert auf Industrie 4.0 und Smart Manufacturing.',
    website: 'https://digital-pioneers-hannover.de',
    email: 'kontakt@digital-pioneers-hannover.de',
    phone: '+49 511 123456',
    specializations: ['Digitalisierung', 'KI-Beratung', 'Prozessoptimierung'],
  },
  {
    name: 'TechConsult Braunschweig',
    city: 'Braunschweig',
    address: 'Bohlweg 30, 38100 Braunschweig',
    latitude: 52.2689,
    longitude: 10.5268,
    description:
      'Experten für Cloud-Migration und IT-Infrastruktur. Enge Zusammenarbeit mit Forschungseinrichtungen und Technologie-Startups in der Region.',
    website: 'https://techconsult-bs.de',
    email: 'info@techconsult-bs.de',
    phone: '+49 531 234567',
    specializations: ['Cloud-Migration', 'Cybersecurity', 'Digitalisierung'],
  },
  {
    name: 'Innovation Hub Oldenburg',
    city: 'Oldenburg',
    address: 'Lange Str. 55, 26122 Oldenburg',
    latitude: 53.1435,
    longitude: 8.2146,
    description:
      'Spezialisiert auf KI-gestützte Geschäftsmodelle und Datenanalyse. Unterstützt KMUs bei der Entwicklung intelligenter Automatisierungslösungen.',
    website: 'https://innovation-hub-ol.de',
    email: 'hello@innovation-hub-ol.de',
    phone: '+49 441 345678',
    specializations: ['KI-Beratung', 'Prozessoptimierung', 'Digitalisierung'],
  },
  {
    name: 'SmartBiz Solutions Osnabrück',
    city: 'Osnabrück',
    address: 'Große Str. 42, 49074 Osnabrück',
    latitude: 52.2799,
    longitude: 8.0472,
    description:
      'Ganzheitliche Beratung für digitale Geschäftsprozesse. Fokus auf ERP-Systeme, Workflow-Automatisierung und Change Management.',
    website: 'https://smartbiz-os.de',
    email: 'beratung@smartbiz-os.de',
    phone: '+49 541 456789',
    specializations: ['Digitalisierung', 'Prozessoptimierung', 'Cloud-Migration'],
  },
  {
    name: 'CyberGuard Göttingen',
    city: 'Göttingen',
    address: 'Weender Str. 25, 37073 Göttingen',
    latitude: 51.5341,
    longitude: 9.9355,
    description:
      'IT-Sicherheit und Compliance-Beratung. Spezialisiert auf DSGVO-konforme Digitalisierung und Penetrationstests für mittelständische Unternehmen.',
    website: 'https://cyberguard-goe.de',
    email: 'security@cyberguard-goe.de',
    phone: '+49 551 567890',
    specializations: ['Cybersecurity', 'Cloud-Migration', 'Digitalisierung'],
  },
  {
    name: 'AutoTech Advisors Wolfsburg',
    city: 'Wolfsburg',
    address: 'Porschestr. 15, 38440 Wolfsburg',
    latitude: 52.4227,
    longitude: 10.7865,
    description:
      'Automotive-Digitalisierung und KI-Integration. Unterstützt Zulieferer und Automobilunternehmen bei Connected Car Technologien und autonomem Fahren.',
    website: 'https://autotech-wob.de',
    email: 'consulting@autotech-wob.de',
    phone: '+49 5361 678901',
    specializations: ['KI-Beratung', 'Digitalisierung', 'Prozessoptimierung'],
  },
]

async function seedCompanies() {
  console.log('🌱 Starte Seed-Prozess für Beispielunternehmen...\n')

  try {
    // 1. Get specialization IDs
    console.log('📋 Lade Spezialisierungen...')
    const { data: specializations, error: specError } = await supabase
      .from('specializations')
      .select('id, name')

    if (specError) {
      throw new Error(`Fehler beim Laden der Spezialisierungen: ${specError.message}`)
    }

    if (!specializations || specializations.length === 0) {
      throw new Error('Keine Spezialisierungen gefunden. Bitte führen Sie zuerst das SQL-Schema aus.')
    }

    console.log(`✅ ${specializations.length} Spezialisierungen gefunden\n`)

    const specMap = new Map(specializations.map((s) => [s.name, s.id]))

    // 2. Insert companies
    let successCount = 0
    let errorCount = 0

    for (const company of exampleCompanies) {
      console.log(`📍 Füge hinzu: ${company.name} (${company.city})`)

      const { specializations: specNames, ...companyData } = company

      // Insert company
      const { data: insertedCompany, error: companyError } = await supabase
        .from('consulting_companies')
        .insert(companyData)
        .select()
        .single()

      if (companyError) {
        console.error(`   ❌ Fehler: ${companyError.message}`)
        errorCount++
        continue
      }

      // Insert specializations
      const specLinks = specNames
        .map((name) => ({
          company_id: insertedCompany.id,
          specialization_id: specMap.get(name),
        }))
        .filter((link) => link.specialization_id)

      if (specLinks.length > 0) {
        const { error: linkError } = await supabase
          .from('company_specializations')
          .insert(specLinks)

        if (linkError) {
          console.error(`   ⚠️  Warnung: Spezialisierungen konnten nicht hinzugefügt werden`)
        }
      }

      console.log(`   ✅ Erfolgreich hinzugefügt (${specLinks.length} Spezialisierungen)`)
      successCount++
    }

    console.log('\n' + '='.repeat(50))
    console.log(`🎉 Seed-Prozess abgeschlossen!`)
    console.log(`✅ Erfolgreich: ${successCount} Unternehmen`)
    if (errorCount > 0) {
      console.log(`❌ Fehler: ${errorCount} Unternehmen`)
    }
    console.log('='.repeat(50))
  } catch (error) {
    console.error('\n❌ Kritischer Fehler beim Seed-Prozess:', error)
    process.exit(1)
  }
}

seedCompanies()



