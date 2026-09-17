import { readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const files = {
  ssq: new URL('../public/data/ssq.json', import.meta.url),
  dlt: new URL('../public/data/dlt.json', import.meta.url),
}

const headers = {
  'user-agent': 'Lottery-Lab/0.1 (+https://github.com)',
  accept: 'application/json,text/plain,*/*',
}

function normalizeDate(value) {
  return String(value ?? '').slice(0, 10)
}

function nums(value) {
  return String(value ?? '')
    .split(/[,\s+|]+/)
    .filter(Boolean)
    .map((item) => Number.parseInt(item, 10))
    .filter(Number.isFinite)
}

async function fetchJson(url) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 15000)
  try {
    const response = await fetch(url, { headers, signal: controller.signal })
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function fetchSsq() {
  const url =
    'https://www.cwl.gov.cn/cwl_admin/front/cwlkj/search/kjxx/findDrawNotice?name=ssq&issueCount=120'
  const json = await fetchJson(url)
  const rows = Array.isArray(json?.result) ? json.result : []
  return rows.map((row) => ({
    issue: String(row.code),
    date: normalizeDate(row.date),
    numbers: { primary: nums(row.red), secondary: nums(row.blue) },
  }))
}

async function fetchDlt() {
  const url =
    'https://webapi.sporttery.cn/gateway/lottery/getHistoryPageListV1.qry?gameNo=85&provinceId=0&pageSize=120&isVerify=1&pageNo=1'
  const json = await fetchJson(url)
  const rows = json?.value?.list ?? json?.data?.list ?? []
  if (!Array.isArray(rows)) return []
  return rows.map((row) => {
    const all = nums(row.lotteryDrawResult ?? row.drawResult ?? row.result)
    return {
      issue: String(row.lotteryDrawNum ?? row.issue ?? row.lotteryDrawIssue),
      date: normalizeDate(row.lotteryDrawTime ?? row.date),
      numbers: {
        primary: all.slice(0, 5).sort((a, b) => a - b),
        secondary: all.slice(5, 7).sort((a, b) => a - b),
      },
    }
  })
}

function valid(draw, type) {
  const primary = type === 'ssq' ? { count: 6, min: 1, max: 33 } : { count: 5, min: 1, max: 35 }
  const secondary = type === 'ssq' ? { count: 1, min: 1, max: 16 } : { count: 2, min: 1, max: 12 }
  const inRange = (values, rule) =>
    values.length === rule.count &&
    new Set(values).size === rule.count &&
    values.every((value) => value >= rule.min && value <= rule.max)
  return (
    draw.issue &&
    draw.date &&
    inRange(draw.numbers.primary, primary) &&
    inRange(draw.numbers.secondary, secondary)
  )
}

async function current(type) {
  if (!existsSync(files[type])) return null
  return JSON.parse(await readFile(files[type], 'utf8'))
}

async function update(type, fetcher, source) {
  try {
    const draws = (await fetcher()).filter((draw) => valid(draw, type))
    if (!draws.length) throw new Error('No valid draws returned')
    const seen = new Set()
    const unique = draws
      .filter((draw) => (seen.has(draw.issue) ? false : seen.add(draw.issue)))
      .sort((a, b) => b.issue.localeCompare(a.issue, 'zh-CN', { numeric: true }))
    await writeFile(
      files[type],
      `${JSON.stringify({ type, source, updatedAt: new Date().toISOString(), draws: unique }, null, 2)}\n`,
    )
    console.log(`Updated ${type}: ${unique.length} draws`)
  } catch (error) {
    const existing = await current(type)
    if (!existing?.draws?.length) throw error
    console.warn(`Keep existing ${type} data: ${error.message}`)
  }
}

await update('ssq', fetchSsq, '中国福彩网 findDrawNotice public endpoint')
await update('dlt', fetchDlt, '中国体彩网 getHistoryPageListV1 public endpoint')
