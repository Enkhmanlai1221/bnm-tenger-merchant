import { orderApi } from "@/apis";
import { IProperty } from "@/interfaces/property";
import { UserType } from "@/interfaces/user";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { setAuthModal } from "@/store/general-slice";
import { message } from "@/utils/message";
import { Alert, Button, Checkbox, cn } from "@heroui/react";
import dayjs from "dayjs";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as yup from "yup";
import { BookingDatePicker } from "../calendar/booking-date-picker";
import { Form } from "../ui/form";
import { PriceDetail } from "./price-detail";
import Link from "next/link";
import { setRememberMe } from "@/store/auth-slice";

export function BookCalculation({
  data,
  onSuccess,
}: {
  data: IProperty;
  onSuccess?: () => void;
}) {
  const searchParams = useSearchParams();
  const searchParamsObj = Object.fromEntries(searchParams.entries());
  const { user } = useSelector((state: RootState) => state.auth);
  const { translate, currencyRate } = useLanguage();

  const formSchema = yup.object().shape({
    startDate: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    endDate: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    quantity: yup
      .number()
      .required(translate("this_field_is_required", "This field is required")),
    isAgree: yup
      .boolean()
      .oneOf(
        [true],
        translate("this_field_is_required", "This field is required"),
      )
      .required(translate("this_field_is_required", "This field is required")),
  });

  const dispatch = useDispatch();
  const [unableToBook, setUnableToBook] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      const order = await orderApi.bookOrder({
        property: data._id,
        startDate: values.startDate,
        endDate: values.endDate,
        personCount: parseInt(values.personCount || 1, 10),
      });
      message.success(
        translate("order_created_successfully", "Order created successfully"),
      );
      router.push(`/bookings/${order._id}?thank=true`);
      onSuccess?.();
    } catch (error: any) {
      dispatch(setRememberMe({
        accountType: "USER",
      }))

      if (error.statusCode === 401) {
        dispatch(setAuthModal(true));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      initialValues={{
        startDate: searchParamsObj.startDate || "",
        endDate: searchParamsObj.endDate || "",
        personCount: searchParamsObj.personCount || 1,
        isAgree: false,
      }}
      onSubmit={onSubmit}
      validationSchema={formSchema}
    >
      {({ values, setFieldValue, setFieldValues, errors }) => {
        const error =
          (values.startDate && values.endDate) || !errors.startDate
            ? undefined
            : translate("this_field_is_required", "This field is required");

        return (
          <div className="flex flex-col gap-y-4 border p-4 rounded-2xl">
            <div className="space-x-1">
              <span className="text-2xl font-medium text-gray-950">
                {currencyRate(data.price)}
              </span>
              <span className="text-xs text-gray-500">
                {translate("per_night", "Per night")}
              </span>
            </div>
            <div className="border border-gray-600 rounded-2xl px-4">
              <div className="">
                <BookingDatePicker
                  // disabled={playtimeMerchant ? true : false}
                  error={error}
                  disabledDates={data.calendars
                    .filter((item) => item.availableQuantity === 0)
                    .map((item) => dayjs(item.date).format("YYYY-MM-DD"))}
                  value={{
                    startDate: values.startDate,
                    endDate: values.endDate,
                  }}
                  onChange={(values) => {
                    setFieldValues(values);
                  }}
                />
              </div>
              <div className="border-b border-gray-600 -mx-4" />
              <div className="py-4 space-y-2">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium">
                        {translate("guest", "Guest")}
                      </span>
                      <span className="text-sm/4 font-light text-gray-600">
                        {translate("guest_count", "Guest count")}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        // disabled={playtimeMerchant ? true : values.personCount <= 1}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (values.personCount > 1) {
                            setFieldValue(
                              "personCount",
                              values.personCount - 1,
                            );
                          }
                        }}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-6 text-center">
                        {values.personCount}
                      </span>
                      <button
                        // disabled={playtimeMerchant ? true :
                        //   values.personCount >=
                        //   data.maxPersonCount * data.quantity
                        // }
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (
                            values.personCount <
                            data.maxPersonCount * data.quantity
                          ) {
                            setFieldValue(
                              "personCount",
                              values.personCount + 1,
                            );
                          }
                        }}
                        className="w-8 h-8 rounded-full border flex items-center justify-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {values.startDate && values.endDate && (
              <PriceDetail
                // collateral={playtimeMerchant}
                propertyId={data._id}
                price={data.price}
                start={values.startDate}
                end={values.endDate}
                personCount={values.personCount}
                maxPersonCount={data.maxPersonCount}
                propertyQuantity={data.quantity}
                onError={() => {
                  setUnableToBook(true);
                }}
                onSuccess={() => {
                  setUnableToBook(false);
                }}
              />
            )}
            {user ? (
              <>
                {user.type === UserType.APP_USER ? (
                  <>
                    <div className="flex flex-col gap-y-2 mb-4">
                      <Checkbox
                        size="lg"
                        checked={values.isAgree === "yes"}
                        onChange={(e) => {
                          e.preventDefault();
                          setFieldValue("isAgree", e.target.checked);
                        }}
                        classNames={{
                          label: cn(
                            "text-sm text-gray-500 leading-4",
                            !values.isAgree && errors.isAgree && "text-red-500",
                          ),
                        }}
                        isInvalid={!!errors.isAgree && !values.isAgree}
                      >
                        {translate(
                          "i_agree_to_the_terms_and_conditions",
                          "I agree to the terms and conditions",
                        )}
                      </Checkbox>
                      <Link
                        className="ml-8 text-sm text-primary-600 leading-none"
                        target="_blank"
                        href="/static-page/terms-and-conditions"
                      >
                        {translate(
                          "view_terms_and_conditions",
                          "View terms and conditions",
                        )}
                      </Link>
                    </div>
                    <Button
                      disabled={unableToBook}
                      type="submit"
                      variant="solid"
                      color="primary"
                      className="flex w-full"
                      size="md"
                      isLoading={loading}
                    >
                      {translate("book_now", "Book now")}
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-gray-500">
                    {translate(
                      "merchant_cannot_book",
                      "Your signed as merchant. merchant can not make booking. Change your account type to user.",
                    )}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex flex-col gap-y-2 mb-4">
                  <Checkbox
                    size="lg"
                    checked={values.isAgree === "yes"}
                    onChange={(e) => {
                      e.preventDefault();
                      setFieldValue("isAgree", e.target.checked);
                    }}
                    classNames={{
                      label: cn(
                        "text-sm text-gray-500 leading-4",
                        !values.isAgree && errors.isAgree && "text-red-500",
                      ),
                    }}
                    isInvalid={!!errors.isAgree && !values.isAgree}
                  >
                    {translate(
                      "i_agree_to_the_terms_and_conditions",
                      "I agree to the terms and conditions",
                    )}
                  </Checkbox>
                  <Link
                    className="ml-8 text-sm text-primary-600 leading-none"
                    target="_blank"
                    href="/static-page/terms-and-conditions"
                  >
                    {translate(
                      "view_terms_and_conditions",
                      "View terms and conditions",
                    )}
                  </Link>
                </div>
                {!data.isClosed ?
                  <Button
                    disabled={unableToBook}
                    type="submit"
                    variant="solid"
                    color="primary"
                    className="flex w-full"
                    size="md"
                    isLoading={loading}
                  >
                    {translate("book_now", "Book now")}
                  </Button>
                  :
                  <div className="flex items-center justify-center w-full">
                    <Alert
                      color="warning"
                      title={translate("warning", "Warning")}
                      description={translate("service_provider_has_temporarily_suspended_operations", "The service provider has temporarily suspended operations at the respective home!")}
                      variant="faded"
                    />
                  </div>
                }
              </>
            )}
          </div>
        );
      }}
    </Form>
  );
}
