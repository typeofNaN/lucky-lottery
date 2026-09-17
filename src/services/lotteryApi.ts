import type { LotteryDataFile, LotteryType } from '../types/lottery'

export async function fetchLotteryData(type: LotteryType): Promise<LotteryDataFile> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/${type}.json`, {
    cache: 'no-store',
  })

  if (!response.ok) {
    throw new Error(`无法加载 ${type} 历史开奖数据`)
  }

  return (await response.json()) as LotteryDataFile
}
