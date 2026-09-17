# Lucky Lottery

双色球、大乐透随机选号、历史开奖数据查询与号码统计工具。

> 本项目仅供娱乐和数据研究使用，不预测彩票开奖结果，不提供任何中奖保证。

## Screenshot

运行 `pnpm dev` 后打开本地地址即可查看首页、历史开奖、统计与收藏页面。

## Features

- 双色球与超级大乐透模式切换
- Crypto API 优先的随机选号
- 1 / 5 / 10 注快捷生成与最多 50 注 Stepper
- 复制号码、收藏号码、localStorage 持久化
- 历史开奖查询、分页、Loading / Empty / Error / Retry
- 最近 30 / 50 / 100 / 全部历史号码出现次数统计
- GitHub Actions 自动部署到 GitHub Pages
- GitHub Actions 定时同步开奖 JSON
- HashRouter 风格路由，适配 GitHub Pages Project Pages

## Tech Stack

React, TypeScript, Vite, pnpm, Tailwind CSS, ESLint, Prettier.

## Getting Started

```bash
pnpm install
pnpm dev
```

## Scripts

```bash
pnpm dev
pnpm lint
pnpm build
pnpm update:data
```

## GitHub Pages Deployment

`.github/workflows/deploy.yml` 会在 `main` 分支 push 时执行：

1. Checkout
2. 安装 pnpm 与 Node.js
3. `pnpm install --frozen-lockfile`
4. `pnpm lint`
5. `pnpm build`
6. 上传 `dist`
7. 部署 GitHub Pages

Vite `base` 会根据 `GITHUB_REPOSITORY` 自动生成，兼容 `https://username.github.io/repository-name/`。

## Lottery Data

前端读取：

- `public/data/ssq.json`
- `public/data/dlt.json`

数据更新由 `.github/workflows/update-lottery-data.yml` 执行，支持每天定时与手动触发。

当前更新脚本优先使用：

- 双色球：中国福彩网公开开奖接口 `findDrawNotice`
- 超级大乐透：中国体彩网公开开奖接口 `getHistoryPageListV1.qry`

脚本会校验号码范围、重复期号和数据格式。接口失败或返回异常时，会保留已有正常 JSON，避免覆盖历史数据。

## Disclaimer

本工具提供的号码由随机算法生成，历史开奖数据仅用于统计与查询。彩票开奖结果具有随机性，历史数据不能预测未来开奖结果。本项目不提供任何中奖保证，请理性参与。

## License

MIT License
