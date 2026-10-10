import { padNumber } from '../utils/lottery'

interface Props {
  value: number
  tone: 'red' | 'blue'
  rolling?: boolean
  size?: 'default' | 'hero'
}

export function LotteryBall({ value, tone, rolling = false, size = 'default' }: Props) {
  return (
    <span className={`lottery-ball ${tone} ${size} ${rolling ? 'rolling' : ''}`}>
      {padNumber(value)}
    </span>
  )
}
