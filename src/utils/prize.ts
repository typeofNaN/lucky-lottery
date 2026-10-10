import type { LotteryNumbers, LotteryType } from '../types/lottery'

export interface PrizeResult {
  level: string | null
  primaryMatches: number
  secondaryMatches: number
}

function countMatches(selected: number[], winning: number[]) {
  const winningSet = new Set(winning)
  return selected.filter((value) => winningSet.has(value)).length
}

export function checkPrize(
  type: LotteryType,
  selected: LotteryNumbers,
  winning: LotteryNumbers,
  issue: string,
): PrizeResult {
  const primaryMatches = countMatches(selected.primary, winning.primary)
  const secondaryMatches = countMatches(selected.secondary, winning.secondary)
  let level: string | null = null

  if (type === 'ssq') {
    if (primaryMatches === 6 && secondaryMatches === 1) level = '一等奖'
    else if (primaryMatches === 6) level = '二等奖'
    else if (primaryMatches === 5 && secondaryMatches === 1) level = '三等奖'
    else if (primaryMatches === 5 || (primaryMatches === 4 && secondaryMatches === 1))
      level = '四等奖'
    else if (primaryMatches === 4 || (primaryMatches === 3 && secondaryMatches === 1))
      level = '五等奖'
    else if (secondaryMatches === 1) level = '六等奖'
  } else if (Number(issue) >= 26014) {
    if (primaryMatches === 5 && secondaryMatches === 2) level = '一等奖'
    else if (primaryMatches === 5 && secondaryMatches === 1) level = '二等奖'
    else if (
      (primaryMatches === 5 && secondaryMatches === 0) ||
      (primaryMatches === 4 && secondaryMatches === 2)
    )
      level = '三等奖'
    else if (primaryMatches === 4 && secondaryMatches === 1) level = '四等奖'
    else if (
      (primaryMatches === 4 && secondaryMatches === 0) ||
      (primaryMatches === 3 && secondaryMatches === 2)
    )
      level = '五等奖'
    else if (
      (primaryMatches === 3 && secondaryMatches === 1) ||
      (primaryMatches === 2 && secondaryMatches === 2)
    )
      level = '六等奖'
    else if (
      primaryMatches === 3 ||
      (primaryMatches === 2 && secondaryMatches === 1) ||
      secondaryMatches === 2
    )
      level = '七等奖'
  } else {
    if (primaryMatches === 5 && secondaryMatches === 2) level = '一等奖'
    else if (primaryMatches === 5 && secondaryMatches === 1) level = '二等奖'
    else if (primaryMatches === 5) level = '三等奖'
    else if (primaryMatches === 4 && secondaryMatches === 2) level = '四等奖'
    else if (primaryMatches === 4 && secondaryMatches === 1) level = '五等奖'
    else if (primaryMatches === 3 && secondaryMatches === 2) level = '六等奖'
    else if (primaryMatches === 4) level = '七等奖'
    else if (
      (primaryMatches === 3 && secondaryMatches === 1) ||
      (primaryMatches === 2 && secondaryMatches === 2)
    )
      level = '八等奖'
    else if (
      primaryMatches === 3 ||
      (primaryMatches === 2 && secondaryMatches === 1) ||
      secondaryMatches === 2
    )
      level = '九等奖'
  }

  return { level, primaryMatches, secondaryMatches }
}
