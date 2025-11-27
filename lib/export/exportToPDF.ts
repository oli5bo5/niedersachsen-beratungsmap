import jsPDF from 'jspdf'
import type { CompanyWithSpecializations } from '@/lib/supabase/types'

/**
 * Export companies to PDF format
 */
export function exportToPDF(companies: CompanyWithSpecializations[]) {
  const doc = new jsPDF()
  
  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('Niedersachsen Beratungsunternehmen', 14, 20)
  
  // Date
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Erstellt am: ${new Date().toLocaleDateString('de-DE')}`, 14, 28)
  doc.text(`Anzahl Unternehmen: ${companies.length}`, 14, 33)
  
  // Line
  doc.line(14, 36, 196, 36)
  
  let yPos = 44
  const lineHeight = 7
  const pageHeight = doc.internal.pageSize.height
  
  companies.forEach((company, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    
    // Company name (bold)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`${index + 1}. ${company.name}`, 14, yPos)
    yPos += lineHeight
    
    // Description
    if (company.description) {
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      const descLines = doc.splitTextToSize(company.description, 170)
      doc.text(descLines, 20, yPos)
      yPos += descLines.length * 5
    }
    
    // Details
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    
    if (company.address) {
      doc.text(`Adresse: ${company.address}`, 20, yPos)
      yPos += 5
    }
    
    if (company.website) {
      doc.text(`Website: ${company.website}`, 20, yPos)
      yPos += 5
    }
    
    if (company.email) {
      doc.text(`Email: ${company.email}`, 20, yPos)
      yPos += 5
    }
    
    if (company.phone) {
      doc.text(`Telefon: ${company.phone}`, 20, yPos)
      yPos += 5
    }
    
    // Specializations
    if (company.specializations.length > 0) {
      const specs = company.specializations.map((s) => s.name).join(', ')
      doc.text(`Spezialisierungen: ${specs}`, 20, yPos)
      yPos += 5
    }
    
    yPos += 5 // Space between companies
  })
  
  // Footer on last page
  const totalPages = doc.internal.pages.length - 1
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text(
      `Seite ${i} von ${totalPages}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: 'center' }
    )
  }
  
  // Save
  const filename = `niedersachsen-beratungsunternehmen-${Date.now()}.pdf`
  doc.save(filename)
}



