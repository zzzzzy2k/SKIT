import { MIN_SERVINGS, MAX_SERVINGS } from '../utils/constants'

export default function ServingSelector({ value, onChange }) {
  const handleChange = (newVal) => {
    const clamped = Math.max(MIN_SERVINGS, Math.min(MAX_SERVINGS, newVal))
    onChange(clamped)
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">人数</span>
      <button
        onClick={() => handleChange(value - 1)}
        disabled={value <= MIN_SERVINGS}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-30"
      >
        −
      </button>
      <input
        type="number"
        min={MIN_SERVINGS}
        max={MAX_SERVINGS}
        value={value}
        onChange={e => handleChange(parseInt(e.target.value) || MIN_SERVINGS)}
        className="w-12 text-center border rounded py-1"
      />
      <button
        onClick={() => handleChange(value + 1)}
        disabled={value >= MAX_SERVINGS}
        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center disabled:opacity-30"
      >
        +
      </button>
      <span className="text-sm text-gray-500">人份</span>
    </div>
  )
}
