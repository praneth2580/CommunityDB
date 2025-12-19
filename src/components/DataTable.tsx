import { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle
} from 'lucide-react'

export interface Column<T = any> {
  key: string
  header: string
  render?: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
}

export function DataTable<T extends { id?: string }>({ data, columns, loading }: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Pagination Logic
  const totalPages = Math.ceil(data?.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = data?.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  if (loading) {
    return (
      <div className="w-full h-64 border rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  if (data?.length === 0) {
    return (
      <div className="w-full h-64 border rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-black flex flex-col items-center justify-center text-slate-500">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p>No records found.</p>
      </div>
    )
  }

  return (
    <div className="w-full border rounded-lg border-slate-200 dark:border-neutral-800 bg-white dark:bg-black flex flex-col">
      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-50 dark:bg-neutral-900 sticky top-0 z-10">
            <tr>
              {columns?.map((col) => (
                <th key={col.key} className="px-3 py-3 font-semibold text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-neutral-800 first:pl-4 last:pr-4">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-neutral-900">
            {currentData?.map((row, idx) => (
              <tr
                key={row.id || idx}
                className="group hover:bg-slate-50 dark:hover:bg-neutral-900/50 transition-colors"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-3 py-3 text-slate-900 dark:text-slate-100 first:pl-4 last:pr-4">
                    {col.render ? col.render(row) : (row as any)[col.key] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-3 py-2 border-t border-slate-200 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-900/30">
          <div className="text-[10px] text-slate-500 dark:text-slate-400">
            Showing{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {startIndex + 1}
            </span>{' '}
            to{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {Math.min(endIndex, data.length)}
            </span>{' '}
            of{' '}
            <span className="font-medium text-slate-900 dark:text-white">
              {data.length}
            </span>
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>

            <div className="flex items-center space-x-1 px-1">
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                if (
                  pageNum === 1 ||
                  pageNum === totalPages ||
                  (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`
                      w-6 h-6 flex items-center justify-center rounded text-[10px] font-medium transition-colors
                      ${currentPage === pageNum ? 'bg-slate-900 text-white dark:bg-white dark:text-black' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-neutral-800'}
                    `}
                    >
                      {pageNum}
                    </button>
                  )
                } else if (
                  (pageNum === currentPage - 2 && pageNum > 1) ||
                  (pageNum === currentPage + 2 && pageNum < totalPages)
                ) {
                  return (
                    <span key={pageNum} className="text-[10px] text-slate-400 px-0.5">...</span>
                  )
                }
                return null
              })}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}