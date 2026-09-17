import type { LotteryNumbers as LotteryNumbersType } from '../types/lottery'
import { LotteryBall } from './LotteryBall'

interface Props {
  numbers: LotteryNumbersType
  rolling?: boolean
}

export function LotteryNumbers({ numbers, rolling }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {numbers.primary.map((value) => (
        <LotteryBall key={`p-${value}`} value={value} tone="red" rolling={rolling} />
      ))}
      <span className="px-1 text-xl font-semibold text-slate-400">+</span>
      {numbers.secondary.map((value) => (
        <LotteryBall key={`s-${value}`} value={value} tone="blue" rolling={rolling} />
      ))}
    </div>
  )
}
