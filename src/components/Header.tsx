function Header() {
  return (
    <div className="flex items-center justify-between p-4 md:px-6 md:py-5">
      <div>
        <img src="/assets/images/logo.svg" alt="fx checker logo" />
      </div>
      <div>
        <div>
          <span className="text-fx-neutral-200 text-preset-6 md:text-preset-4 inline-block uppercase">
            55 currencies · eod · ecb data
          </span>
        </div>
      </div>
    </div>
  )
}

export default Header
