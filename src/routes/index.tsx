import { fetchCurrenciesOptions } from '@/api/currencies'
import { fetchHistoryRatesOptions } from '@/api/historyrates'
import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import { fetchSingleRateOptions } from '@/api/singlecurrency'
import CheckRate from '@/components/CheckRate'
import Header from '@/components/Header'
import HistoryContent from '@/components/HistoryContent'
import LiveTicker from '@/components/LiveTicker'
import Tabs, { Tab } from '@/components/Tabs'
import { useCurrencyStore } from '@/store/store'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  validateSearch: (search: Record<string, unknown>) => ({
    base: (search.base as string | undefined) ?? 'USD',
    quote: (search.quote as string | undefined) ?? 'EUR',
  }),
  loaderDeps: ({ search }) => ({ base: search.base, quote: search.quote }),
  component: Home,
  loader: async ({ context, deps }) => {
    const { period } = useCurrencyStore.getState()

    await Promise.all([
      context.queryClient.ensureQueryData(fetchLiveRatesOptions()),
      context.queryClient.ensureQueryData(fetchYesterdayRatesOptions()),
      context.queryClient.ensureQueryData(fetchCurrenciesOptions()),
      context.queryClient.ensureQueryData(
        fetchSingleRateOptions(deps.base, deps.quote, 1000),
      ),
      context.queryClient.ensureQueryData(
        fetchHistoryRatesOptions(deps.base, deps.quote, period),
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
        <main className="w-full px-4 py-8 md:px-6 md:py-12 lg:mx-auto lg:max-w-275 lg:px-8">
          <CheckRate />
          <section className="mt-10 lg:mt-8">
            <Tabs defaultTab="history">
              <Tab title="history">
                <HistoryContent />
              </Tab>
              <Tab title="compare">
                <h1>Compare</h1>
              </Tab>
              <Tab title="favorites">
                <h1>Favorites</h1>
              </Tab>
              <Tab title="log">
                <h1>Log</h1>
              </Tab>
            </Tabs>
          </section>
        </main>
      </body>
    </>
  )
}
