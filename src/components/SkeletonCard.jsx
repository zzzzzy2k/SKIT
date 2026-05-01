export default function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-4 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 bg-warm-200 rounded-full w-16"></div>
        <div className="h-4 bg-warm-200 rounded-full w-20"></div>
      </div>
      <div className="h-6 bg-warm-200 rounded-lg w-2/3 mb-3"></div>
      <div className="flex gap-2">
        <div className="h-5 bg-warm-200 rounded-full w-14"></div>
        <div className="h-5 bg-warm-200 rounded-full w-16"></div>
        <div className="h-5 bg-warm-200 rounded-full w-12"></div>
      </div>
    </div>
  )
}
