import {
  fetchLiveRatesOptions,
  fetchYesterdayRatesOptions,
} from '@/api/liverates'
import { useSuspenseQuery } from '@tanstack/react-query'

function LiveTicker() {
  const { data: liveRates } = useSuspenseQuery(fetchLiveRatesOptions())
  const { data: yesterdayRates } = useSuspenseQuery(
    fetchYesterdayRatesOptions(),
  )

  

  console.log('liverates', liveRates)
  console.log('yesterrates', yesterdayRates)

  return (
    <div className="flex items-center">
      <div className="bg-fx-lime-500 px-4 py-3">
        <span className="text-fx-neutral-900 text-preset-5 inline-block uppercase">
          &#9679; live markets
        </span>
      </div>
      <div>
        <h1>Rates</h1>
      </div>
    </div>
  )
}

export default LiveTicker
