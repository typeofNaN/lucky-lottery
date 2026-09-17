import { Notice } from '../components/Notice'

export function About() {
  return (
    <div className="grid max-w-3xl gap-6 mx-auto">
      <div>
        <h1 className="text-3xl font-black">关于 Lucky Lottery</h1>
        <p className="mt-3 leading-7 text-slate-600">
          Lucky Lottery
          是一个面向双色球与超级大乐透的随机选号、历史开奖查询与号码出现次数统计工具。项目使用
          React、TypeScript、Vite 与 Tailwind CSS 构建，适合部署到 GitHub Pages。
        </p>
      </div>
      <Notice />
      <section className="p-5 bg-white border rounded-2xl border-slate-200">
        <h2 className="mb-3 text-lg font-bold">数据来源</h2>
        <p className="leading-7 text-slate-600">
          项目采用 GitHub Actions 定时同步静态 JSON
          的架构。双色球更新脚本优先请求中国福彩网公开开奖接口；大乐透更新脚本优先请求中国体彩网公开开奖接口。浏览器端只读取项目内的静态
          JSON，避免 GitHub Pages 运行时受到第三方接口 CORS、频率或临时故障影响。
        </p>
      </section>
      <section className="p-5 bg-white border rounded-2xl border-slate-200">
        <h2 className="mb-3 text-lg font-bold">开源协议</h2>
        <p className="leading-7 text-slate-600">本项目使用 MIT License。欢迎学习、修改和自托管。</p>
      </section>
    </div>
  )
}
