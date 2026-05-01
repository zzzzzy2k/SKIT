import { Link } from 'react-router-dom'

export default function EmptyState({ message, actionText, actionTo }) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 bg-warm-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-warm-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3" />
        </svg>
      </div>
      <p className="text-warm-500 mb-6 text-lg">{message}</p>
      {actionText && actionTo && (
        <Link
          to={actionTo}
          className="inline-flex items-center gap-2 text-primary-600 font-medium hover:text-primary-700 transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          {actionText}
        </Link>
      )}
    </div>
  )
}
