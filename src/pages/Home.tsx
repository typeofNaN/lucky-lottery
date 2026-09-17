import { Copy, Minus, Plus, Save, Sparkles } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { LotteryNumbers } from '../components/LotteryNumbers'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { Notice } from '../components/Notice'
import { fetchLotteryData } from '../services/lotteryApi'
import type {
  DrawResult,
  LotteryNumbers as LotteryNumbersType,
  LotteryType,
  SavedLottery,
} from '../types/lottery'
import { formatNumbers, generateLotteryNumbers } from '../utils/lottery'
import { loadSavedLotteries, saveLotteries } from '../utils/storage'

interface Props {
  type: LotteryType
  setType: (type: LotteryType) => void
  notify: (message: string) => void
}

export function Home({ type, setType, notify }: Props) {
  const config = LOTTERY_CONFIGS[type]
  const [count, setCount] = useState(5)
  const [rolling, setRolling] = useState(false)
  const [results, setResults] = useState<LotteryNumbersType[]>([generateLotteryNumbers(config)])
  const [latest, setLatest] = useState<DrawResult | null>(null)

  useEffect(() => {
    setResults([generateLotteryNumbers(config)])
    fetchLotteryData(type)
      .then((data) => setLatest(data.draws[0] ?? null))
      .catch(() => setLatest(null))
  }, [config, type])

  const heroNumbers = useMemo(() => results[0], [results])

  function generate() {
    setRolling(true)
    window.setTimeout(
      () => {
        setResults(Array.from({ length: count }, () => generateLotteryNumbers(config)))
        setRolling(false)
      },
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450,
    )
  }

  async function copy(numbers: LotteryNumbersType) {
    await navigator.clipboard.writeText(formatNumbers(numbers))
    notify('已复制')
  }

  function save(numbers: LotteryNumbersType) {
    const item: SavedLottery = {
      id: crypto.randomUUID(),
      type,
      numbers,
      createdAt: Date.now(),
    }
    saveLotteries([item, ...loadSavedLotteries()])
    notify('已收藏')
  }

  return (
    <div className="grid gap-8">
      <section className="grid gap-6 py-4 md:grid-cols-[1.05fr_.95fr] md:items-center md:py-10">
        <div className="grid gap-5">
          <LotterySwitcher value={type} onChange={setType} />
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950 sm:text-6xl">
              Lucky Lottery
            </h1>
            <p className="mt-3 text-lg text-slate-600">随机选号 · 历史数据 · 开奖查询</p>
          </div>
          <Notice />
        </div>
        <div className="rounded-[2rem] border border-slate-200 bg-white p-5 shadow-sm">
          <p className="mb-4 text-sm font-semibold text-slate-500">{config.name} 随机号码</p>
          <LotteryNumbers numbers={heroNumbers} rolling={rolling} />
        </div>
      </section>

      <section className="grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">随机生成</h2>
            <p className="text-sm text-slate-500">使用浏览器 Crypto API 优先生成随机号码。</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 5, 10].map((value) => (
              <button
                key={value}
                onClick={() => setCount(value)}
                className={`rounded-full px-3 py-2 text-sm font-semibold ${count === value ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}
              >
                {value} 注
              </button>
            ))}
            <button
              className="grid rounded-full h-9 w-9 place-items-center bg-slate-100"
              onClick={() => setCount(Math.max(1, count - 1))}
              aria-label="减少注数"
            >
              <Minus size={16} />
            </button>
            <span className="w-8 text-sm font-bold text-center">{count}</span>
            <button
              className="grid rounded-full h-9 w-9 place-items-center bg-slate-100"
              onClick={() => setCount(Math.min(50, count + 1))}
              aria-label="增加注数"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
        <button
          onClick={generate}
          className="inline-flex items-center gap-2 px-5 py-3 text-sm font-bold text-white rounded-full shadow-lg w-fit bg-slate-950"
        >
          <Sparkles size={18} /> 生成号码
        </button>
        <div className="grid gap-3">
          {results.map((numbers, index) => (
            <div
              key={`${formatNumbers(numbers)}-${index}`}
              className="flex flex-col gap-3 p-4 border rounded-2xl border-slate-200 sm:flex-row sm:items-center sm:justify-between"
            >
              <LotteryNumbers numbers={numbers} rolling={rolling} />
              <div className="flex gap-2">
                <button
                  onClick={() => copy(numbers)}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full bg-slate-100"
                >
                  <Copy size={16} />
                  复制
                </button>
                <button
                  onClick={() => save(numbers)}
                  className="inline-flex items-center gap-1 px-3 py-2 text-sm font-semibold rounded-full bg-rose-50 text-rose-700"
                >
                  <Save size={16} />
                  收藏
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {latest ? (
        <section className="rounded-[2rem] bg-slate-900 p-5 text-white">
          <p className="text-sm text-slate-300">
            最新开奖 · {latest.issue} · {latest.date}
          </p>
          <div className="mt-3">
            <LotteryNumbers numbers={latest.numbers} />
          </div>
        </section>
      ) : null}
    </div>
  )
}
