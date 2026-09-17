import { useEffect, useState } from 'react'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { fetchLotteryData } from '../services/lotteryApi'
import type { DrawResult, LotteryType } from '../types/lottery'
import { getFrequency, padNumber } from '../utils/lottery'

const scopes = [30, 50, 100, 0]

export function Statistics({
  type,
  setType,
}: {
  type: LotteryType
  setType: (type: LotteryType) => void
}) {
  const [draws, setDraws] = useState<DrawResult[]>([])
  const [scope, setScope] = useState(100)
  const config = LOTTERY_CONFIGS[type]

  useEffect(() => {
    fetchLotteryData(type)
      .then((data) => setDraws(data.draws))
      .catch(() => setDraws([]))
  }, [type])

  const selected = scope === 0 ? draws : draws.slice(0, scope)
  const primary = getFrequency(
    selected.map((draw) => draw.numbers),
    config.primary.min,
    config.primary.max,
    'primary',
  )
  const secondary = getFrequency(
    selected.map((draw) => draw.numbers),
    config.secondary.min,
    config.secondary.max,
    'secondary',
  )
  const max = Math.max(
    ...primary.map((item) => item.count),
    ...secondary.map((item) => item.count),
    1,
  )

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">历史号码统计</h1>
          <p className="mt-2 text-slate-500">统计仅描述已发生开奖数据，不构成任何未来结果预测。</p>
        </div>
        <LotterySwitcher value={type} onChange={setType} />
      </div>
      <div className="flex flex-wrap gap-2">
        {scopes.map((value) => (
          <button
            key={value}
            onClick={() => setScope(value)}
            className={`rounded-full px-4 py-2 text-sm font-bold ${scope === value ? 'bg-slate-950 text-white' : 'bg-white text-slate-600'}`}
          >
            {value === 0 ? '全部历史' : `最近 ${value} 期`}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title={config.primaryLabel} items={primary} max={max} tone="red" />
        <Panel title={config.secondaryLabel} items={secondary} max={max} tone="blue" />
      </div>
    </div>
  )
}

function Panel({
  title,
  items,
  max,
  tone,
}: {
  title: string
  items: { number: number; count: number }[]
  max: number
  tone: 'red' | 'blue'
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5">
      <h2 className="mb-4 text-lg font-bold">{title}</h2>
      <div className="grid gap-2">
        {items.map((item) => (
          <div
            key={item.number}
            className="grid grid-cols-[2.5rem_1fr_3rem] items-center gap-3 text-sm"
          >
            <span
              className={`grid h-8 w-8 place-items-center rounded-full font-bold text-white ${tone === 'red' ? 'bg-red-500' : 'bg-blue-500'}`}
            >
              {padNumber(item.number)}
            </span>
            <div className="h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className={`h-full rounded-full ${tone === 'red' ? 'bg-red-400' : 'bg-blue-400'}`}
                style={{ width: `${(item.count / max) * 100}%` }}
              />
            </div>
            <span className="text-right font-semibold text-slate-600">{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
