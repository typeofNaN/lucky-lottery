export type LotteryType = 'ssq' | 'dlt'

export interface LotteryNumbers {
  primary: number[]
  secondary: number[]
}

export interface LotteryConfig {
  id: LotteryType
  name: string
  shortName: string
  primaryLabel: string
  secondaryLabel: string
  primary: { min: number; max: number; count: number }
  secondary: { min: number; max: number; count: number }
}

export interface DrawResult {
  issue: string
  date: string
  numbers: LotteryNumbers
}

export interface LotteryDataFile {
  type: LotteryType
  source: string
  updatedAt: string
  draws: DrawResult[]
}

export interface SavedLottery {
  id: string
  type: LotteryType
  numbers: LotteryNumbers
  createdAt: number
}
