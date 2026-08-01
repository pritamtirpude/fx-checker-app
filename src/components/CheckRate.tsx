import RateCard from './RateCard'

function CheckRate() {
  return (
    <section>
      <h1 className="text-preset-2 text-fx-neutral-50 uppercase">
        check the rate
      </h1>
      <div className="bg-fx-neutral-700 mt-4 rounded-[20px] p-5">
        <div className="flex items-center gap-6">
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
      </div>
    </section>
  )
}

export default CheckRate
