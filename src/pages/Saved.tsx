import { Copy, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { LotteryNumbers } from '../components/LotteryNumbers'
import type { SavedLottery } from '../types/lottery'
import { formatNumbers } from '../utils/lottery'
import { loadSavedLotteries, saveLotteries } from '../utils/storage'

export function Saved({ notify }: { notify: (message: string) => void }) {
  const [items, setItems] = useState<SavedLottery[]>([])

  useEffect(() => setItems(loadSavedLotteries()), [])

  function update(next: SavedLottery[]) {
    setItems(next)
    saveLotteries(next)
  }

  async function copy(item: SavedLottery) {
    await navigator.clipboard.writeText(formatNumbers(item.numbers))
    notify('已复制')
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">我的号码</h1>
          <p className="mt-2 text-slate-500">收藏保存在当前浏览器 localStorage 中。</p>
        </div>
        {items.length ? (
          <button
            onClick={() => update([])}
            className="rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white"
          >
            清空
          </button>
        ) : null}
      </div>
      {items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
          还没有收藏的号码。
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <article
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  {LOTTERY_CONFIGS[item.type].name} ·{' '}
                  {new Date(item.createdAt).toLocaleString('zh-CN')}
                </p>
                <LotteryNumbers numbers={item.numbers} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => copy(item)}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-3 py-2 text-sm font-semibold"
                >
                  <Copy size={16} />
                  复制
                </button>
                <button
                  onClick={() => update(items.filter((value) => value.id !== item.id))}
                  className="inline-flex items-center gap-1 rounded-full bg-red-50 px-3 py-2 text-sm font-semibold text-red-700"
                >
                  <Trash2 size={16} />
                  删除
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
