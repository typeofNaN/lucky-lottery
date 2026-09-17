import { LOTTERY_CONFIGS, LOTTERY_TYPES } from '../config/lottery'
import type { LotteryType } from '../types/lottery'

interface Props {
  value: LotteryType
  onChange: (value: LotteryType) => void
}

export function LotterySwitcher({ value, onChange }: Props) {
  return (
    <div className="inline-flex rounded-full border border-slate-200 bg-white p-1 shadow-sm">
      {LOTTERY_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            value === type ? 'bg-slate-950 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {LOTTERY_CONFIGS[type].name}
        </button>
      ))}
    </div>
  )
}
