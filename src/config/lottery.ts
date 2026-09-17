import type { LotteryConfig, LotteryType } from '../types/lottery'

export const LOTTERY_CONFIGS: Record<LotteryType, LotteryConfig> = {
  ssq: {
    id: 'ssq',
    name: '双色球',
    shortName: 'SSQ',
    primaryLabel: '红球',
    secondaryLabel: '蓝球',
    primary: { min: 1, max: 33, count: 6 },
    secondary: { min: 1, max: 16, count: 1 },
  },
  dlt: {
    id: 'dlt',
    name: '超级大乐透',
    shortName: 'DLT',
    primaryLabel: '前区',
    secondaryLabel: '后区',
    primary: { min: 1, max: 35, count: 5 },
    secondary: { min: 1, max: 12, count: 2 },
  },
}

export const LOTTERY_TYPES = Object.keys(LOTTERY_CONFIGS) as LotteryType[]
