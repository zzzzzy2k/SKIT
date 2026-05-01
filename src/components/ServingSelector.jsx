import { MIN_SERVINGS, MAX_SERVINGS } from '../utils/constants'

export default function ServingSelector({ value, onChange }) {
  const handleChange = (newVal) => {
    const clamped = Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, newVal))
    onChange(clamped)
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-warm-600">人数</span>
      <div className="flex items-center gap-2 bg-warm-50 rounded-xl p-1">
        <button
          onClick={() => handleChange(value - 1)}
          disabled={value <= MIN_SERVINGS}
          className="w-9 h-9 rounded-lg bg-white text-warm-600 flex items-center justify-center
                     shadow-sm hover:bg-warm-50 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14" />
          </svg>
        </button>
        <input
          type="number"
          min={MIN_SERVINGS}
          max={MAX_SERVINGS}
          value={value}
          onChange={e => handleChange(parseInt(e.target.value) || MIN_SERVINGS)}
          className="w-12 text-center text-lg font-semibold text-warm-800 bg-transparent border-0 focus:outline-none"
        />
        <button
          onClick={() => handleChange(value + 1)}
          disabled={value >= MAX_SERVINGS}
          className="w-9 h-9 rounded-lg bg-white text-warm-600 flex items-center justify-center
                     shadow-sm hover:bg-warm-50 disabled:opacity-30 disabled:cursor-not-allowed
                     transition-all duration-150 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>
      <span className="text-sm text-warm-400">人份</span>
    </div>
  )
}
