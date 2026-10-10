import { Award, CircleHelp, ExternalLink } from 'lucide-react'
import { LotterySwitcher } from '../components/LotterySwitcher'
import { LOTTERY_CONFIGS } from '../config/lottery'
import type { LotteryType } from '../types/lottery'

interface PrizeRule {
  level: string
  matches: string[]
  prize: string
  note?: string
}

const RULES: Record<LotteryType, PrizeRule[]> = {
  ssq: [
    {
      level: '一等奖',
      matches: ['6 红 + 1 蓝'],
      prize: '浮动奖金',
      note: '单注奖金最高 1,000 万元',
    },
    { level: '二等奖', matches: ['6 红 + 0 蓝'], prize: '浮动奖金', note: '单注奖金最高 500 万元' },
    { level: '三等奖', matches: ['5 红 + 1 蓝'], prize: '3,000 元' },
    { level: '四等奖', matches: ['5 红 + 0 蓝', '4 红 + 1 蓝'], prize: '200 元' },
    { level: '五等奖', matches: ['4 红 + 0 蓝', '3 红 + 1 蓝'], prize: '10 元' },
    { level: '六等奖', matches: ['0—2 红 + 1 蓝'], prize: '5 元' },
  ],
  dlt: [
    {
      level: '一等奖',
      matches: ['5 前区 + 2 后区'],
      prize: '浮动奖金',
      note: '基本投注单注最高 1,000 万元',
    },
    {
      level: '二等奖',
      matches: ['5 前区 + 1 后区'],
      prize: '浮动奖金',
      note: '基本投注单注最高 500 万元',
    },
    { level: '三等奖', matches: ['5 前区 + 0 后区', '4 前区 + 2 后区'], prize: '5,000 / 6,666 元' },
    { level: '四等奖', matches: ['4 前区 + 1 后区'], prize: '300 / 380 元' },
    { level: '五等奖', matches: ['4 前区 + 0 后区', '3 前区 + 2 后区'], prize: '150 / 200 元' },
    { level: '六等奖', matches: ['3 前区 + 1 后区', '2 前区 + 2 后区'], prize: '15 / 18 元' },
    {
      level: '七等奖',
      matches: ['3 前区 + 0 后区', '2 前区 + 1 后区', '1 前区 + 2 后区', '0 前区 + 2 后区'],
      prize: '5 / 7 元',
    },
  ],
}

const OFFICIAL_RULES: Record<LotteryType, string> = {
  ssq: 'https://www.cwl.gov.cn/',
  dlt: 'https://m.lottery.gov.cn/ksjz/m/yxgz_dlt/',
}

interface Props {
  type: LotteryType
  setType: (type: LotteryType) => void
}

export function Rules({ type, setType }: Props) {
  const config = LOTTERY_CONFIGS[type]
  const isDlt = type === 'dlt'

  return (
    <div className="rules-page">
      <header className="rules-heading">
        <div>
          <span className="section-kicker">PRIZE GUIDE · 中奖规则</span>
          <h1>
            看懂每一种
            <br />
            <em>中奖组合</em>
          </h1>
          <p>按单式投注号码与当期开奖号码的相符情况，确定最高中奖奖级。</p>
        </div>
        <div className="rules-switcher">
          <span>选择彩种</span>
          <LotterySwitcher value={type} onChange={setType} />
        </div>
      </header>

      <section className="rules-summary" aria-label={`${config.name}投注说明`}>
        <div className="summary-mark">
          <Award aria-hidden="true" />
        </div>
        <div>
          <span>{config.shortName} · BASIC BET</span>
          <h2>{config.name}</h2>
        </div>
        <p>
          从 {config.primary.min}—{config.primary.max} 中选择{' '}
          <strong>{config.primary.count}</strong> 个{config.primaryLabel}， 从{' '}
          {config.secondary.min}—{config.secondary.max} 中选择{' '}
          <strong>{config.secondary.count}</strong> 个{config.secondaryLabel}。
        </p>
        <div className="summary-price">
          <strong>¥ 2</strong>
          <span>每注</span>
        </div>
      </section>

      <section className="prize-table" aria-label={`${config.name}奖级表`}>
        <div className="prize-table-head">
          <span>奖级</span>
          <span>命中条件</span>
          <span>单注奖金</span>
        </div>
        {RULES[type].map((rule, index) => (
          <article className="prize-row" key={rule.level}>
            <div className="prize-level">
              <small>{String(index + 1).padStart(2, '0')}</small>
              <strong>{rule.level}</strong>
            </div>
            <div className="match-list">
              {rule.matches.map((match) => (
                <span key={match}>{match}</span>
              ))}
            </div>
            <div className="prize-value">
              <strong>{rule.prize}</strong>
              {rule.note ? <small>{rule.note}</small> : null}
            </div>
          </article>
        ))}
      </section>

      <section className="rules-notes">
        <div className="notes-title">
          <CircleHelp aria-hidden="true" />
          <div>
            <span>PLEASE NOTE</span>
            <h2>规则说明</h2>
          </div>
        </div>
        <div className="notes-grid">
          <p>
            <strong>01</strong> 每注号码只兑付所中的最高奖级，不兼中兼得；另行设立的特别奖除外。
          </p>
          <p>
            <strong>02</strong> 一、二等奖为浮动奖，实际奖金随当期销量、奖池和中奖注数变化。
          </p>
          {isDlt ? (
            <>
              <p>
                <strong>03</strong> 固定奖斜线后的金额适用于开奖前奖池达到 8 亿元（含）时。
              </p>
              <p>
                <strong>04</strong> 追加投注每注 1
                元，仅参与一、二等奖分配，追加奖金为基本投注对应奖金的 80%。
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>03</strong> 六等奖只需蓝球命中；红球命中 0、1 或 2 个均属于同一中奖条件。
              </p>
              <p>
                <strong>04</strong> 中奖者应自开奖之日起 60 个自然日内，持中奖彩票到指定地点兑奖。
              </p>
            </>
          )}
        </div>
        <a href={OFFICIAL_RULES[type]} target="_blank" rel="noreferrer">
          查看官方游戏规则 <ExternalLink />
        </a>
      </section>
    </div>
  )
}
