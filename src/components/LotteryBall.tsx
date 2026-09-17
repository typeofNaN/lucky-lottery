import { padNumber } from '../utils/lottery'

interface Props {
  value: number
  tone: 'red' | 'blue'
  rolling?: boolean
}

export function LotteryBall({ value, tone, rolling = false }: Props) {
  const color =
    tone === 'red'
      ? 'from-rose-400 via-red-500 to-red-700'
      : 'from-sky-300 via-blue-500 to-blue-700'

  return (
    <span
      className={`grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br ${color} text-sm font-bold text-white shadow-ball sm:h-12 sm:w-12 sm:text-base ${
        rolling ? 'motion-safe:animate-bounce' : ''
      }`}
    >
      {padNumber(value)}
    </span>
  )
}
