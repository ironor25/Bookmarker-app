'use client'

import { Trash2 } from 'lucide-react'
import { useState } from 'react'

type BookmarkCardProps = {
  id: string
  title: string
  url: string
  onDelete: (id: string) => Promise<void>
}

export function BookmarkCard({ id, title, url, onDelete }: BookmarkCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete(id)
    } finally {
      setIsDeleting(false)
    }
  }

  const displayUrl = new URL(url).hostname.replace('www.', '')

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:bg-white/10 hover:border-teal-400/30 hover:shadow-lg hover:shadow-teal-500/20 hover:scale-105 animate-fade-in"
    >
      <div className="space-y-3">
        <h3 className="font-semibold text-white group-hover:text-teal-300 transition-colors line-clamp-2 text-lg">
          {title}
        </h3>
        <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors truncate">
          {displayUrl}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.preventDefault()
          handleDelete()
        }}
        disabled={isDeleting}
        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 disabled:opacity-50"
        aria-label="Delete bookmark"
      >
        <Trash2 size={18} />
      </button>
    </a>
  )
}
