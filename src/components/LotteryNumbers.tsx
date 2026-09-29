import type { LotteryNumbers as LotteryNumbersType } from '../types/lottery'
import { LotteryBall } from './LotteryBall'

interface Props {
  numbers: LotteryNumbersType
  rolling?: boolean
  size?: 'default' | 'hero'
}

export function LotteryNumbers({ numbers, rolling, size = 'default' }: Props) {
  return (
    <div className={`lottery-numbers ${size}`}>
      {numbers.primary.map((value) => (
        <LotteryBall key={`p-${value}`} value={value} tone="red" rolling={rolling} size={size} />
      ))}
      <span className="number-plus">+</span>
      {numbers.secondary.map((value) => (
        <LotteryBall key={`s-${value}`} value={value} tone="blue" rolling={rolling} size={size} />
      ))}
    </div>
  )
}
