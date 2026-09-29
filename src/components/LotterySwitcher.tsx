import { LOTTERY_CONFIGS, LOTTERY_TYPES } from '../config/lottery'
import type { LotteryType } from '../types/lottery'

interface Props {
  value: LotteryType
  onChange: (value: LotteryType) => void
}

export function LotterySwitcher({ value, onChange }: Props) {
  return (
    <div className="lottery-switcher">
      {LOTTERY_TYPES.map((type) => (
        <button
          key={type}
          onClick={() => onChange(type)}
          className={value === type ? 'active' : ''}
        >
          {LOTTERY_CONFIGS[type].name}
        </button>
      ))}
    </div>
  )
}
