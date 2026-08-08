import { fetchCurrenciesOptions } from '@/api/currencies'
import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import { fetchSingleRateOptions } from '@/api/singlecurrency'
import CheckRate from '@/components/CheckRate'
import Header from '@/components/Header'
import LiveTicker from '@/components/LiveTicker'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    base: (search.base as string | undefined) ?? 'USD',
    quote: (search.quote as string | undefined) ?? 'EUR',
  }),
  loaderDeps: ({ search }) => ({ base: search.base, quote: search.quote }),
  component: Home,
  loader: async ({ context, deps }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(fetchLiveRatesOptions()),
      context.queryClient.ensureQueryData(fetchYesterdayRatesOptions()),
      context.queryClient.ensureQueryData(fetchCurrenciesOptions()),
      context.queryClient.ensureQueryData(
        fetchSingleRateOptions(deps.base, deps.quote, 1000),
      ),
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
