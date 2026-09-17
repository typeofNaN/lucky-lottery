import { Menu, X } from 'lucide-react'
import { useState } from 'react'

const nav = [
  { href: '#/', label: '首页' },
  { href: '#/history', label: '历史开奖' },
  { href: '#/statistics', label: '数据统计' },
  { href: '#/saved', label: '我的号码' },
  { href: '#/about', label: '关于' },
]

export function Layout({ children, route }: { children: React.ReactNode; route: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="flex items-center justify-between max-w-6xl px-4 py-3 mx-auto">
          <a href="#/" className="text-lg font-black tracking-tight">
            Lucky Lottery
          </a>
          <nav className="items-center hidden gap-1 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`rounded-full px-3 py-2 text-sm font-medium ${
                  route === item.href.slice(1)
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <button
            className="grid w-10 h-10 border rounded-full place-items-center border-slate-200 md:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label="切换导航"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        {open ? (
          <nav className="grid gap-1 px-4 py-3 bg-white border-t border-slate-100 md:hidden">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-sm font-medium rounded-xl text-slate-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}
      </header>
      <main className="max-w-6xl px-4 py-8 mx-auto">{children}</main>
      <footer className="max-w-6xl px-4 py-10 mx-auto text-sm text-slate-500">
        MIT License · 仅供娱乐和数据研究使用
      </footer>
    </div>
  )
}
