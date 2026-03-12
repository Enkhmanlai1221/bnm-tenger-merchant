import { DISCOUNT_TYPES, IDiscount } from "@/interfaces/discount";
import { useLanguage } from "@/providers/language";
import { DiscountShower } from "../discount/discount-shower";

export interface IPriceDetailViewType {
  days: number;
  amount: number;
  discount: number;
  totalAmount: number;
  price: number;
  personCount: number;
  propertyQuantity: number;
  maxPersonCount: number;
}

export const PriceDetailView = ({ data, collateral }: { data: IPriceDetailViewType, collateral?: boolean }) => {
  const { translate, currencyRate } = useLanguage();

  const gerCount = Math.ceil(data.personCount / data.maxPersonCount);
  const nightsPrice = (data.price || 0) * (data.days || 0);
  const isSpacialPrice = data.amount !== nightsPrice * gerCount;

  return (
    <div>
      <div className="space-y-2 ">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-800">
            Хэд хонох
          </div>
          <div className="text-sm font-light text-gray-800">
            <span className="mr-2">
              {data.days} хоног
            </span>
            <span>{currencyRate(nightsPrice)}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-800">
            Гэр
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-light text-gray-800">
              {gerCount} гэр
            </span>
            <span className="text-sm font-light text-gray-800">
              {gerCount > 1 ? currencyRate(nightsPrice * gerCount || 0) : "~"}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between my-2">
        <h3 className="text-sm font-semibold text-gray-800">
          Нийт үнэ
        </h3>
        <span className="">
          {isSpacialPrice ? (
            <div className="flex flex-col items-end">
              <span className="text-sm font-light line-through text-red-600 leading-3">
                {currencyRate(nightsPrice * gerCount || 0)}
              </span>
              <div className="flex items-center gap-1">
                <div className="text-xs font-light text-green-800">
                  Онцгой үнэ
                </div>
                <span className="text-base font-semibold text-green-800">
                  {currencyRate(data.amount || 0)}
                </span>
              </div>
            </div>
          ) : (
            <span className="text-sm font-semibold text-gray-800">
              {currencyRate(data.amount || 0)}
            </span>
          )}
        </span>
      </div>
      <hr className="my-2 border-dashed" />
      {collateral ? (
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-semibold text-gray-800">
            {translate("collateral", "Collateral")}
          </h3>
          <span className="text-base font-semibold text-gray-800">
            {currencyRate(500000)}
          </span>
        </div>
      ) : null}
      <hr className="my-2 border-dashed" />
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-gray-800">
          {translate("total_usd", "Total (USD)")}
        </h3>
        <span className="text-base font-semibold text-gray-800">
          {currencyRate((data?.totalAmount || 0) + (collateral ? 500000 : 0))}
        </span>
      </div>
    </div>
  );
};
