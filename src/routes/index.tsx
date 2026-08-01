import { fetchCurrenciesOptions } from '@/api/currencies'
import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import CheckRate from '@/components/CheckRate'
import Header from '@/components/Header'
import LiveTicker from '@/components/LiveTicker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(fetchLiveRatesOptions()),
      context.queryClient.ensureQueryData(fetchYesterdayRatesOptions()),
      context.queryClient.ensureQueryData(fetchCurrenciesOptions()),
    ])
  },
})

function Home() {
  return (
    <>
      <header>
        <nav>
          <Header />
          <LiveTicker />
        </nav>
      </header>
      <body>
        <main className="mx-auto w-full max-w-275 px-8 py-12">
          <CheckRate />
        </main>
      </body>
    </>
  )
}
