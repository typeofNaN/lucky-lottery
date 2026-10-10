import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { href: '#/', label: '首页' },
  { href: '#/history', label: '历史开奖' },
  { href: '#/statistics', label: '数据统计' },
  { href: '#/saved', label: '我的号码' },
  { href: '#/rules', label: '中奖规则' },
  { href: '#/about', label: '关于' },
]

export function Layout({ children, route }: { children: React.ReactNode; route: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="site-shell">
      <header className="site-header">
        <div className="header-inner">
          <a href="#/" className="brand">
            <span>LUCKY</span>
            <i>/</i> LOTTERY
          </a>
          <nav className="desktop-nav" aria-label="主导航">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={route === item.href.slice(1) ? 'active' : ''}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button className="menu-button" onClick={() => setOpen(!open)} aria-label="切换导航">
            {open ? <X /> : <Menu />}
          </button>
        </div>
        {open ? (
          <nav className="mobile-nav">
            {nav.map((item) => (
              <a key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <span>LUCKY / LOTTERY</span>
        <p>MIT License · 仅供娱乐和数据研究使用</p>
      </footer>
    </div>
  )
}
