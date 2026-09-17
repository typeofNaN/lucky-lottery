import type { LotteryConfig, LotteryNumbers } from '../types/lottery'
import { randomInt } from './random'

export function padNumber(value: number): string {
  return value.toString().padStart(2, '0')
}

function pickUnique(range: LotteryConfig['primary'], count: number): number[] {
  const pool = Array.from({ length: range.max - range.min + 1 }, (_, index) => range.min + index)
  const picked: number[] = []

  while (picked.length < count) {
    const index = randomInt(pool.length)
    const [value] = pool.splice(index, 1)
    picked.push(value)
  }

  return picked.sort((a, b) => a - b)
}

export function generateLotteryNumbers(config: LotteryConfig): LotteryNumbers {
  return {
    primary: pickUnique(config.primary, config.primary.count),
    secondary: pickUnique(config.secondary, config.secondary.count),
  }
}

export function formatNumbers(numbers: LotteryNumbers): string {
  return `${numbers.primary.map(padNumber).join(' ')} + ${numbers.secondary.map(padNumber).join(' ')}`
}

export function getFrequency(
  draws: LotteryNumbers[],
  min: number,
  max: number,
  area: keyof LotteryNumbers,
) {
  const counts = Array.from({ length: max - min + 1 }, (_, index) => ({
    number: min + index,
    count: 0,
  }))

  draws.forEach((draw) => {
    draw[area].forEach((value) => {
      counts[value - min].count += 1
    })
  })

  return counts
}
