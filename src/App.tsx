import { useEffect, useState } from 'react'
import { Layout } from './components/Layout'
import { Toast } from './components/Toast'
import type { LotteryType } from './types/lottery'
import { Home } from './pages/Home'
import { History } from './pages/History'
import { Statistics } from './pages/Statistics'
import { Saved } from './pages/Saved'
import { About } from './pages/About'

function getRoute() {
  return window.location.hash.replace('#', '') || '/'
}

export default function App() {
  const [route, setRoute] = useState(getRoute())
  const [type, setType] = useState<LotteryType>('ssq')
  const [toast, setToast] = useState('')

  useEffect(() => {
    const onHashChange = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function notify(message: string) {
    setToast(message)
    window.setTimeout(() => setToast(''), 1600)
  }

  const page =
    route === '/history' ? (
      <History type={type} setType={setType} />
    ) : route === '/statistics' ? (
      <Statistics type={type} setType={setType} />
    ) : route === '/saved' ? (
      <Saved notify={notify} />
    ) : route === '/about' ? (
      <About />
    ) : (
      <Home type={type} setType={setType} notify={notify} />
    )

  return (
    <Layout route={route}>
      {page}
      <Toast message={toast} />
    </Layout>
  )
}
