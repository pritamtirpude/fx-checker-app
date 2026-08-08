import { cn } from '@/utils'
import { NumericFormat } from 'react-number-format'
import CurrencyDropdown from './CurrencyDropdown'

type RateCardType = 'text' | 'readonly'

type RateCardProps = {
  title: string
  inputType: RateCardType
  defaultCode: string
  value?: string
  onChange?: (value: string) => void
}

function RateCard({
  title,
  inputType,
  defaultCode,
  value = '',
  onChange,
}: RateCardProps) {
  return (
    <div className="outline-fx-neutral-500 bg-fx-neutral-600 w-full rounded-2xl p-5 outline">
      <h2 className="text-preset-4 text-fx-neutral-100 uppercase">{title}</h2>
      <div className="mt-5 flex w-full items-center justify-between">
        <div className="flex-1">
          <NumericFormat
            thousandSeparator=","
            decimalScale={2}
            allowNegative={false}
            value={value}
            onValueChange={(vals) => onChange?.(vals.value)}
            placeholder={'0'}
            readOnly={inputType === 'readonly'}
            className={cn(
              'text-preset-1 focus:ring-fx-lime-500 w-full outline-none focus:rounded-lg focus:ring-2',
            )}
          />
        </div>
        <div className="ml-auto flex flex-1 justify-end">
          <CurrencyDropdown
            slot={title === 'send' ? 'send' : 'receive'}
            defaultCode={defaultCode}
          />
        </div>
      </div>
    </div>
  )
}

export default RateCard
