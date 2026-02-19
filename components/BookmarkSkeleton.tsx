export function BookmarkSkeleton() {
  return (
    <div className="glass rounded-2xl p-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-6 bg-white/10 rounded-lg w-3/4" />
        <div className="h-4 bg-white/10 rounded-lg w-1/2" />
      </div>
    </div>
  )
}

export function BookmarkGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <BookmarkSkeleton key={i} />
      ))}
    </div>
  )
}
