import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import Header from '@/components/Header'
import LiveTicker from '@/components/LiveTicker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
  loader: async ({ context }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(fetchLiveRatesOptions()),
      context.queryClient.ensureQueryData(fetchYesterdayRatesOptions()),
    ])
  },
  gcTime: 0,
  staleTime: 0,
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
    </>
  )
}
