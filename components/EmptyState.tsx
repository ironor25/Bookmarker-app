import { BookmarkIcon } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 p-4 rounded-full bg-teal-500/10 border border-teal-500/20">
        <BookmarkIcon size={32} className="text-teal-400" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No bookmarks yet</h3>
      <p className="text-gray-400 max-w-sm">
        Start adding bookmarks to organize your favorite links. They'll sync instantly across your devices.
      </p>
    </div>
  )
}
