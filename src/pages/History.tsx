import { RefreshCw } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { LotteryNumbers } from '../components/LotteryNumbers'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { fetchLotteryData } from '../services/lotteryApi'
import type { DrawResult, LotteryType } from '../types/lottery'

export function History({
  type,
  setType,
}: {
  type: LotteryType
  setType: (type: LotteryType) => void
}) {
  const [draws, setDraws] = useState<DrawResult[]>([])
  const [status, setStatus] = useState<'loading' | 'ok' | 'empty' | 'error'>('loading')
  const [page, setPage] = useState(1)
  const pageSize = 12

  function load() {
    setStatus('loading')
    fetchLotteryData(type)
      .then((data) => {
        setDraws(data.draws)
        setStatus(data.draws.length ? 'ok' : 'empty')
        setPage(1)
      })
      .catch(() => setStatus('error'))
  }

  useEffect(load, [type])

  const pageDraws = draws.slice((page - 1) * pageSize, page * pageSize)
  const pageCount = Math.max(1, Math.ceil(draws.length / pageSize))

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">历史开奖</h1>
          <p className="mt-2 text-slate-500">按最新期号倒序展示，数据来自静态 JSON 同步结果。</p>
        </div>
        <LotterySwitcher value={type} onChange={setType} />
      </div>

      {status === 'loading' ? <State text="正在加载历史开奖数据..." /> : null}
      {status === 'empty' ? <State text="暂无历史开奖数据。" /> : null}
      {status === 'error' ? (
        <div className="p-5 text-red-700 border border-red-200 rounded-2xl bg-red-50">
          加载失败。
          <button onClick={load} className="inline-flex items-center gap-1 ml-3 font-bold">
            <RefreshCw size={16} />
            重试
          </button>
        </div>
      ) : null}

      {status === 'ok' ? (
        <>
          <div className="hidden overflow-hidden bg-white border rounded-2xl border-slate-200 md:block">
            <table className="w-full">
              <thead className="text-sm text-left bg-slate-100 text-slate-500">
                <tr>
                  <th className="p-4">期号</th>
                  <th className="p-4">开奖日期</th>
                  <th className="p-4">开奖号码</th>
                </tr>
              </thead>
              <tbody>
                {pageDraws.map((draw) => (
                  <tr key={draw.issue} className="border-t border-slate-100">
                    <td className="p-4 font-semibold">{draw.issue}</td>
                    <td className="p-4 text-slate-600">{draw.date}</td>
                    <td className="p-4">
                      <LotteryNumbers numbers={draw.numbers} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid gap-3 md:hidden">
            {pageDraws.map((draw) => (
              <article
                key={draw.issue}
                className="p-4 bg-white border rounded-2xl border-slate-200"
              >
                <p className="mb-3 text-sm font-semibold text-slate-500">
                  {LOTTERY_CONFIGS[type].name} · {draw.issue} · {draw.date}
                </p>
                <LotteryNumbers numbers={draw.numbers} />
              </article>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((value) => value - 1)}
              className="px-4 py-2 text-sm font-bold bg-white rounded-full disabled:opacity-40"
            >
              上一页
            </button>
            <span className="text-sm text-slate-500">
              {page} / {pageCount}
            </span>
            <button
              disabled={page === pageCount}
              onClick={() => setPage((value) => value + 1)}
              className="px-4 py-2 text-sm font-bold bg-white rounded-full disabled:opacity-40"
            >
              下一页
            </button>
          </div>
        </>
      ) : null}
    </div>
  )
}

function State({ text }: { text: string }) {
  return (
    <div className="p-8 text-center bg-white border rounded-2xl border-slate-200 text-slate-500">
      {text}
    </div>
  )
}
