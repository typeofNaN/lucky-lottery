import { ArrowRight, Copy, Heart } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { LotteryNumbers } from '../components/LotteryNumbers'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { Notice } from '../components/Notice'
import { fetchLotteryData } from '../services/lotteryApi'
import type { DrawResult, LotteryNumbers as LotteryNumbersType, LotteryType, SavedLottery } from '../types/lottery'
import { formatNumbers, generateLotteryNumbers } from '../utils/lottery'
import { loadSavedLotteries, saveLotteries } from '../utils/storage'

interface Props { type: LotteryType; setType: (type: LotteryType) => void; notify: (message: string) => void }

export function Home({ type, setType, notify }: Props) {
  const config = LOTTERY_CONFIGS[type]
  const [count, setCount] = useState(1)
  const [rolling, setRolling] = useState(false)
  const [results, setResults] = useState<LotteryNumbersType[]>([generateLotteryNumbers(config)])
  const [latest, setLatest] = useState<DrawResult | null>(null)
  useEffect(() => {
    setResults([generateLotteryNumbers(config)])
    fetchLotteryData(type).then((data) => setLatest(data.draws[0] ?? null)).catch(() => setLatest(null))
  }, [config, type])
  const heroNumbers = useMemo(() => results[0], [results])
  function generate() {
    setRolling(true)
    window.setTimeout(() => { setResults(Array.from({ length: count }, () => generateLotteryNumbers(config))); setRolling(false) }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 450)
  }
  async function copy(numbers: LotteryNumbersType) { await navigator.clipboard.writeText(formatNumbers(numbers)); notify('号码已复制') }
  function save(numbers: LotteryNumbersType) {
    const item: SavedLottery = { id: crypto.randomUUID(), type, numbers, createdAt: Date.now() }
    saveLotteries([item, ...loadSavedLotteries()]); notify('已收藏这组号码')
  }
  return <div className="home-page">
    <section className="hero-shell">
      <div className="hero-copy"><h1>让随机，<br /><span>成为一种期待</span></h1><p className="hero-subtitle">一组号码，一次轻盈的想象</p><Notice /></div>
      <div className="edition-mark" aria-hidden="true"><span>GOOD<br />NUMBERS<br />A BRIGHTER<br />TOMORROW</span><i /><span>2026<br />09.27<br />SUN</span></div>
      <img className="hero-still-life" src="/assets/hero-still-life.png" alt="" aria-hidden="true" />
      <span className="still-life-copy" aria-hidden="true">SMALL<br />RANDOM<br />BIG<br />POSSIBILITIES</span>
      <div className="hero-result" aria-live="polite"><LotteryNumbers numbers={heroNumbers} rolling={rolling} size="hero" /></div>
    </section>
    <section className="generator-panel">
      <div className="generator-controls">
        <div className="control-line"><span>选择彩种</span><LotterySwitcher value={type} onChange={setType} /></div>
        <div className="control-line"><span>生成注数</span><div className="count-options" aria-label="选择注数">{[1, 5, 10].map((value) => <button key={value} onClick={() => setCount(value)} className={count === value ? 'active' : ''}><strong>{value}</strong> 注</button>)}</div></div>
        <button className="generate-button" onClick={generate} disabled={rolling}>{rolling ? '正在生成…' : '生成新号码'} <ArrowRight /></button>
      </div>
      <div className="results-area">
        <div className="results-heading"><h2>{config.name}</h2><span>共 <strong>{results.length}</strong> 注</span></div>
        <div className="result-list">{results.map((numbers, index) => <div className="result-row" key={`${formatNumbers(numbers)}-${index}`}><LotteryNumbers numbers={numbers} rolling={rolling} /><div className="result-actions"><button onClick={() => copy(numbers)} aria-label="复制号码"><Copy /> <span>复制</span></button><button onClick={() => save(numbers)} aria-label="收藏号码"><Heart /> <span>收藏</span></button></div></div>)}</div>
      </div>
    </section>
    {latest ? <section className="latest-rail"><h2>最新开奖</h2><div className="latest-meta"><strong>第 {latest.issue} 期</strong><span>{latest.date.replaceAll('-', '.')}</span></div><a href="#/history">查看历史 <ArrowRight /></a></section> : null}
  </div>
}
