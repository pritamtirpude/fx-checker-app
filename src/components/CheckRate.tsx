import RateCard from './RateCard'

function CheckRate() {
  const dummyRate = {
    date: '2026-08-04',
    base: 'USD',
    quote: 'EUR',
    rate: 0.868,
  }
  return (
    <section>
      <h1 className="text-preset-2 text-fx-neutral-50 uppercase">
        check the rate
      </h1>
      <div className="bg-fx-neutral-700 mt-4 rounded-[20px]">
        <div className="flex items-center gap-6 p-5">
          <RateCard title="send" inputType="text" defaultCode="USD" />
          <button className="outline-fx-neutral-500 bg-fx-neutral-600 focus:ring-fx-lime-500 flex shrink-0 cursor-pointer items-center justify-center rounded-lg p-3.5 outline focus:ring-2">
            <img
              src="/assets/images/icon-exchange.svg"
              alt="exchange"
              className="size-5"
            />
          </button>
          <RateCard title="receive" inputType="readonly" defaultCode="EUR" />
        </div>
        <div className="h-0.5 w-full bg-[linear-gradient(to_right,var(--color-fx-neutral-500)_50%,transparent_50%)] bg-size-[10px_100%]" />

        <div className="flex items-center justify-between p-5">
          <div>
            <p className="text-preset-5 text-fx-neutral-50">
              1 <span>{dummyRate.base}</span> = {dummyRate.rate}{' '}
              <span>{dummyRate.quote}</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-preset-5-medium text-fx-neutral-200 outline-fx-neutral-300 focus:outline-fx-lime-500 focus:bg-fx-lime-500 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 uppercase outline transition-colors focus:outline-2 focus:outline-offset-2">
              <img src="/assets/images/icon-star.svg" alt="star icon" />
              favorited
            </button>
            <button className="text-preset-5-medium hover:bg-fx-lime-800 text-fx-neutral-200 focus:outline-fx-lime-500 outline-fx-neutral-300 flex cursor-pointer items-center gap-2 rounded-lg px-2 py-3 uppercase outline-2 transition-colors focus:outline-2 focus:outline-offset-2">
              log conversion
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CheckRate
