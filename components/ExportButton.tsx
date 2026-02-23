'use client'
import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch('/api/export')
      const data = await res.json()

      const XLSX = await import('xlsx')

      const wb = XLSX.utils.book_new()

      const ws1 = XLSX.utils.json_to_sheet(data.employees)
      ws1['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 20 }, { wch: 12 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, ws1, 'Employees')

      const ws2 = XLSX.utils.json_to_sheet(data.okrs)
      ws2['!cols'] = [{ wch: 12 }, { wch: 40 }, { wch: 30 }, { wch: 20 }, { wch: 10 }, { wch: 25 }, { wch: 60 }, { wch: 10 }, { wch: 15 }]
      XLSX.utils.book_append_sheet(wb, ws2, 'OKRs')

      const ws3 = XLSX.utils.json_to_sheet(data.updates)
      ws3['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 12 }, { wch: 35 }, { wch: 8 }, { wch: 60 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, ws3, 'Weekly Updates')

      const ws4 = XLSX.utils.json_to_sheet(data.management_reports)
      ws4['!cols'] = [{ wch: 12 }, { wch: 25 }, { wch: 20 }, { wch: 60 }, { wch: 40 }, { wch: 20 }]
      XLSX.utils.book_append_sheet(wb, ws4, 'Management Reports')

      const date = new Date().toISOString().split('T')[0]
      XLSX.writeFile(wb, `OKR-Pulse-Export-${date}.xlsx`)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Export failed. Please try again.')
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 text-xs border border-surface-2 text-ink px-4 py-2 rounded-sm hover:bg-surface hover:border-muted transition-colors disabled:opacity-50"
    >
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {loading ? 'Exporting...' : 'Export to Excel'}
    </button>
  )
}
