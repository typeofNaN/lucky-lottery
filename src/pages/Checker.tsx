import { SearchCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { LotteryNumbers } from '../components/LotteryNumbers'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { LOTTERY_CONFIGS } from '../config/lottery'
import { fetchLotteryData } from '../services/lotteryApi'
import type {
  DrawResult,
  LotteryNumbers as LotteryNumbersType,
  LotteryType,
} from '../types/lottery'
import { formatNumbers } from '../utils/lottery'
import { checkPrize, type PrizeResult } from '../utils/prize'

interface Props {
  type: LotteryType
  setType: (type: LotteryType) => void
}

function parseNumbers(value: string, type: LotteryType): LotteryNumbersType {
  const config = LOTTERY_CONFIGS[type]
  const parts = value.trim().split(/\s*[+|]\s*/)
  if (parts.length !== 2)
    throw new Error(`请用“+”分隔${config.primaryLabel}和${config.secondaryLabel}`)

  const parseArea = (text: string) =>
    text
      .trim()
      .split(/[\s,，、]+/)
      .filter(Boolean)
      .map(Number)
  const primary = parseArea(parts[0])
  const secondary = parseArea(parts[1])

  const validate = (numbers: number[], area: 'primary' | 'secondary', label: string) => {
    const range = config[area]
    if (numbers.length !== range.count) throw new Error(`${label}需要输入 ${range.count} 个号码`)
    if (
      numbers.some(
        (number) => !Number.isInteger(number) || number < range.min || number > range.max,
      )
    ) {
      throw new Error(`${label}号码范围应为 ${range.min}—${range.max}`)
    }
    if (new Set(numbers).size !== numbers.length) throw new Error(`${label}号码不能重复`)
  }

  validate(primary, 'primary', config.primaryLabel)
  validate(secondary, 'secondary', config.secondaryLabel)
  return { primary: primary.sort((a, b) => a - b), secondary: secondary.sort((a, b) => a - b) }
}

export function Checker({ type, setType }: Props) {
  const config = LOTTERY_CONFIGS[type]
  const [draws, setDraws] = useState<DrawResult[]>([])
  const [issue, setIssue] = useState('')
  const [input, setInput] = useState('')
  const [count, setCount] = useState(1)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ prize: PrizeResult; numbers: LotteryNumbersType } | null>(
    null,
  )
  const selectedDraw = draws.find((draw) => draw.issue === issue)

  useEffect(() => {
    setDraws([])
    setIssue('')
    setInput('')
    setResult(null)
    setError('')
    fetchLotteryData(type)
      .then((data) => {
        setDraws(data.draws)
        setIssue(data.draws[0]?.issue ?? '')
      })
      .catch(() => setError('开奖数据加载失败，请稍后重试。'))
  }, [type])

  function verify() {
    if (!selectedDraw) return setError('请选择需要验证的开奖期数。')
    try {
      const numbers = parseNumbers(input, type)
      setResult({
        prize: checkPrize(type, numbers, selectedDraw.numbers, selectedDraw.issue),
        numbers,
      })
      setError('')
    } catch (reason) {
      setResult(null)
      setError(reason instanceof Error ? reason.message : '号码格式不正确')
    }
  }

  const example = type === 'ssq' ? '01 02 03 04 05 06 + 07' : '01 02 03 04 05 + 06 07'

  return (
    <div className="checker-page">
      <header className="checker-heading">
        <div>
          <span className="section-kicker">PRIZE CHECK · 中奖验证</span>
          <h1>
            核对号码，<em>揭晓结果</em>
          </h1>
          <p>选择历史开奖期数，输入一注号码，即可验证命中情况与中奖奖级。</p>
        </div>
        <div className="rules-switcher">
          <span>选择彩种</span>
          <LotterySwitcher value={type} onChange={setType} />
        </div>
      </header>

      <div className="checker-layout">
        <section className="checker-form">
          <div className="checker-field">
            <label htmlFor="checker-issue">开奖期数</label>
            <select
              id="checker-issue"
              value={issue}
              onChange={(event) => {
                setIssue(event.target.value)
                setResult(null)
              }}
            >
              {draws.map((draw) => (
                <option key={draw.issue} value={draw.issue}>
                  第 {draw.issue} 期 · {draw.date}
                </option>
              ))}
            </select>
          </div>
          {selectedDraw ? (
            <div className="winning-preview">
              <span>本期开奖号码</span>
              <LotteryNumbers numbers={selectedDraw.numbers} />
            </div>
          ) : null}
          <div className="checker-field">
            <label htmlFor="checker-numbers">投注号码</label>
            <input
              id="checker-numbers"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={example}
              onKeyDown={(event) => {
                if (event.key === 'Enter') verify()
              }}
            />
            <small>格式示例：{example}</small>
          </div>
          <div className="checker-field compact">
            <label htmlFor="checker-count">相同号码注数</label>
            <input
              id="checker-count"
              type="number"
              min="1"
              max="99"
              value={count}
              onChange={(event) =>
                setCount(Math.min(99, Math.max(1, Number(event.target.value) || 1)))
              }
            />
            <small>用于计算该号码共中得几注同等奖级</small>
          </div>
          {error ? (
            <p className="checker-error" role="alert">
              {error}
            </p>
          ) : null}
          <button className="check-button" onClick={verify}>
            <SearchCheck /> 开始验证
          </button>
        </section>

        <section className={`checker-result ${result ? 'has-result' : ''}`} aria-live="polite">
          {!result ? (
            <div className="result-empty">
              <span>CHECK</span>
              <strong>等待验证</strong>
              <p>输入号码后，结果将在这里显示。</p>
            </div>
          ) : (
            <>
              <div className="result-label">第 {issue} 期 · 验证结果</div>
              <div className="checked-numbers">{formatNumbers(result.numbers)}</div>
              <div className="result-award">
                <span>{result.prize.level ? '恭喜中奖' : '本注结果'}</span>
                <strong>{result.prize.level ?? '未中奖'}</strong>
                {result.prize.level ? (
                  <em>
                    共 {count} 注 {result.prize.level}
                  </em>
                ) : (
                  <em>感谢参与，理性购彩</em>
                )}
              </div>
              <div className="match-summary">
                <span>
                  {config.primaryLabel}
                  <strong>{result.prize.primaryMatches}</strong>个
                </span>
                <i />
                <span>
                  {config.secondaryLabel}
                  <strong>{result.prize.secondaryMatches}</strong>个
                </span>
              </div>
              <p className="result-disclaimer">
                验证结果仅供参考，最终结果与奖金请以官方开奖公告及中奖彩票为准。
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  )
}
