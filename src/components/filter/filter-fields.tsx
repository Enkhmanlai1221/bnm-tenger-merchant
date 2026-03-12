import { stayApi } from "@/apis";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";
import { RootState } from "@/store";
import { Button, Chip, cn, Slider } from "@heroui/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import qs from "qs";
import { useState } from "react";
import { useSelector } from "react-redux";
import useSWR from "swr";
import { useLanguage } from "@/providers/language";

export function FilterFields({
  values,
  setFieldValues,
}: {
  values: any;
  setFieldValues: any;
}) {
  const { translate, currencyRate } = useLanguage();
  const [rangeValues, setRangeValues] = useState<{
    priceMin: number;
    priceMax: number;
  }>({
    priceMin: values.priceMin || 0,
    priceMax: values.priceMax || 0,
  });
  const { indexedAvailableTags } = useSelector(
    (state: RootState) => state.general,
  );
  const router = useRouter();
  const pathname = usePathname();
  const [fallbackData, setFallbackData] = useState<any>({
    filters: {
      priceMin: undefined,
      priceMax: undefined,
      count: undefined,
      personCount: {
        min: undefined,
      },
      placeOffers: undefined,
      merchant: undefined,
      level1: undefined,
      tags: undefined,
      query: undefined,
    },
    indexedPlaceOffers: {},
    indexedTags: {},
  });

  const { data: filterInitRefData } = useSWR(
    `swr.filterInitRef.data`,
    () => stayApi.filter({}),
    {
      revalidateOnFocus: false,
    },
  );

  const { data: filterRefData, isValidating } = useSWR(
    `/properties/filters?${qs.stringify(values)}`,
    async () => {
      const res = await stayApi.filter({
        ...values,
        personCount: {
          min: values.personCount,
        },
      });
      const fixedRes = {
        filters: res,
        indexedPlaceOffers: res.placeOffers.reduce(
          (acc: { [key: string]: any }, placeOffer) => {
            acc[placeOffer._id] = placeOffer;
            return acc;
          },
          {},
        ),
        indexedTags: res.tags.reduce((acc: { [key: string]: any }, tag) => {
          acc[tag._id] = tag;
          return acc;
        }, {}),
      };
      setFallbackData(fixedRes);
      await new Promise((resolve) => setTimeout(resolve, 500));
      return fixedRes;
    },
    {
      revalidateOnFocus: false,
      fallbackData: fallbackData,
    },
  );

  const handleRangeValuesChange = useDebouncedCallback(
    async (values: { priceMin: number; priceMax: number }) => {
      setFieldValues(values);
    },
    500,
  );

  if (!filterInitRefData) return null;

  return (
    <div className="flex flex-col divide-y divide-gray-200">
      <div className="py-4">
        <div className="flex justify-between flex-row gap-x-2">
          <div className="text-md font-medium mb-2">
            {translate("price", "Price")}
          </div>
          <div className="flex flex-row gap-x-2">
            <div className="text-md font-medium mb-2">
              {translate("from", "From")}{" "}
              {currencyRate(
                rangeValues.priceMin || filterInitRefData?.priceMin,
                0,
              )}
            </div>
            <div className="text-md font-medium mb-2">
              {translate("to", "To")}{" "}
              {currencyRate(
                rangeValues.priceMax || filterInitRefData?.priceMax,
                0,
              )}
            </div>
          </div>
        </div>
        <Slider
          value={[
            rangeValues.priceMin || filterInitRefData?.priceMin,
            rangeValues.priceMax || filterInitRefData?.priceMax,
          ]}
          onChange={(value) => {
            setRangeValues({
              priceMin: Array.isArray(value) ? value[0] : value,
              priceMax: Array.isArray(value) ? value[1] : value,
            });
          }}
          onChangeEnd={(value) => {
            handleRangeValuesChange({
              priceMin: Array.isArray(value) ? value[0] : value,
              priceMax: Array.isArray(value) ? value[1] : value,
            });
          }}
          maxValue={Math.ceil(
            filterInitRefData?.priceMax + filterInitRefData?.priceMax / 5,
          )}
          minValue={Math.floor(
            filterInitRefData?.priceMin - filterInitRefData?.priceMin / 5,
          )}
          step={
            filterInitRefData?.priceMax - filterInitRefData?.priceMin > 10000
              ? 5000
              : 500
          }
        />
      </div>

      <div className="py-4">
        <div className="text-md font-medium mb-2">
          {translate("place_offers", "Place Offers")}
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {(filterRefData?.filters?.placeOffers || []).map((placeOffer) => (
            <Button
              key={placeOffer._id}
              color="default"
              variant={
                values.placeOffers?.includes(placeOffer._id) ? "solid" : "light"
              }
              startContent={
                <Image
                  src={placeOffer.image.url}
                  alt={placeOffer.name}
                  width={24}
                  height={24}
                  className="h-6 w-6 object-contain"
                />
              }
              onPress={() => {
                if (values.placeOffers?.includes(placeOffer._id)) {
                  setFieldValues({
                    ...values,
                    placeOffers: values.placeOffers.filter(
                      (id: string) => id !== placeOffer._id,
                    ),
                  });
                } else {
                  setFieldValues({
                    ...values,
                    placeOffers: [
                      ...(values.placeOffers || []),
                      placeOffer._id,
                    ],
                  });
                }
              }}
            >
              {translate(placeOffer.name, placeOffer.name)}
            </Button>
          ))}
        </div>
      </div>

      <div className="py-4">
        <div className="text-md font-medium mb-2">
          {translate("tags", "Tags")}
        </div>
        <div className="flex flex-row gap-2 flex-wrap">
          {(filterRefData?.filters?.tags || []).map((tag) => (
            <Button
              key={tag._id}
              color="default"
              variant={values.tags?.includes(tag._id) ? "solid" : "light"}
              startContent={
                <Image src={tag.icon} alt={tag.name} width={24} height={24} />
              }
              onPress={() => {
                if (values.tags?.includes(tag._id)) {
                  setFieldValues({
                    ...values,
                    tags: values.tags.filter((id: string) => id !== tag._id),
                  });
                } else {
                  setFieldValues({
                    ...values,
                    tags: [...(values.tags || []), tag._id],
                  });
                }
              }}
            >
              {translate(tag.name, tag.name)}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-x-2 py-4">
        <Button
          color="default"
          variant="light"
          onPress={() => {
            router.push(
              `${pathname}${qs.stringify(
                {
                  ...values,
                  tags: null,
                  merchant: null,
                  priceMin: null,
                  priceMax: null,
                  placeOffers: null,
                },
                { addQueryPrefix: true, skipNulls: true },
              )}`,
            );
            setFieldValues({
              ...values,
              tags: null,
              merchant: null,
              priceMin: null,
              priceMax: null,
              placeOffers: null,
            });
            setRangeValues({
              priceMin: filterInitRefData?.priceMin,
              priceMax: filterInitRefData?.priceMax,
            });
          }}
        >
          {translate("clear_all", "Clear all")}
        </Button>
        <Button
          color="primary"
          type="submit"
          isLoading={isValidating}
          isDisabled={filterRefData?.filters?.count === 0}
        >
          {filterRefData?.filters?.count || 0
            ? `${translate("show", "Show")} ${filterRefData?.filters?.count} ${translate("stays", "stays")}`
            : `${translate("no_stays_available", "No stays available")}`}
        </Button>
      </div>
    </div>
  );
}
