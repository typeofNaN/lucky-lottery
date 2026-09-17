import type { SavedLottery } from '../types/lottery'

const KEY = 'lottery-lab:saved'

export function loadSavedLotteries(): SavedLottery[] {
  const raw = localStorage.getItem(KEY)
  if (!raw) return []

  try {
    const parsed = JSON.parse(raw) as SavedLottery[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLotteries(items: SavedLottery[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}
