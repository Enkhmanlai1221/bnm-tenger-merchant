import { DISCOUNT_TYPES } from "@/interfaces/discount";
import { useLanguage } from "@/providers/language";

export function DiscountShower({
  discountObj,
}: {
  discountObj: {
    type: DISCOUNT_TYPES;
    value: number;
    rate: number;
  };
}) {
  const { translate } = useLanguage();
  return (
    <div className="flex items-center gap-2">
      <div className="">
        {
          {
            [DISCOUNT_TYPES.DAY]: (
              <span>
                {discountObj.value}{" "}
                {translate(
                  "or_more_nights_of_booking",
                  "or more nights of booking",
                )}
              </span>
            ),
            [DISCOUNT_TYPES.ORDER]: (
              <span>
                {translate("first", "First")} {discountObj.value}{" "}
                {translate("order", "order")}
              </span>
            ),
          }[discountObj.type]
        }
      </div>
      <div className="">
        <span>{discountObj.rate}%</span>
      </div>
    </div>
  );
}
