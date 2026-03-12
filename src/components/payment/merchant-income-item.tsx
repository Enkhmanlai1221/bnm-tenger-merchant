import { IconCreditCardRefund } from "@tabler/icons-react";
import { useLanguage } from '@/providers/language';

const MerchantIncomeItem = () => {
  const { translate } = useLanguage();
  return (
    <div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 border rounded-2xl p-4">
        <div className="flex flex-col gap-y-2 lg:border-r">
          <div className="flex items-center gap-x-2">
            <IconCreditCardRefund className="text-primary-600" />
            <span>{translate('niyt_orlogo', 'Нийт орлого')}</span>
          </div>
          <div className="space-x-2">
            <span className="text-3xl font-semibold text-primary-600">
              4,000,000₮
            </span>
            <span className="text-lg text-gray-600">{translate('12_zahialga', '12 захиалга')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-2 lg:border-r">
          <span>{translate('niyt_orlogo', 'Нийт орлого')}</span>
          <div className="space-x-2">
            <span className="text-xl font-semibold text-primary-600">
              450,000₮
            </span>
            <span className="text-gray-600">{translate('12_zahialga', '12 захиалга')}</span>
          </div>
        </div>
        <div className="flex flex-col gap-y-2">
          <span>{translate('niyt_orlogo', 'Нийт орлого')}</span>
          <div className="space-x-2">
            <span className="text-xl font-semibold text-primary-600">
              4,000,000₮
            </span>
            <span className="text-gray-600">{translate('12_zahialga', '12 захиалга')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MerchantIncomeItem };
