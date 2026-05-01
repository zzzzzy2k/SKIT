import { Link } from 'react-router-dom'

export default function EmptyState({ message, actionText, actionTo }) {
  return (
    <div className="text-center py-16">
      <p className="text-4xl mb-4">🍽️</p>
      <p className="text-gray-500 mb-4">{message}</p>
      {actionText && actionTo && (
        <Link to={actionTo} className="text-primary-600 font-medium">
          {actionText}
        </Link>
      )}
    </div>
  )
}
