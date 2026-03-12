import { Form } from "@/components/ui/form";

import { orderApi } from "@/apis";
import { ApplePayButton } from "@/components/apple-pay/apple-pay-button";
import { PaymentMethodPicker } from "@/components/payment/payment-method-picker";
import { BOOKING_STATUS, IBooking } from "@/interfaces/booking";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { startApplePaySession } from "@/utils/apple-pay";
import { Button, Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";
import NumberField from "@/components/ui/form/number-field";
import { CancelForm } from "./cancel-form";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { UserType } from "@/interfaces/user";

export function PayForm({
  data,
  onSuccess,
  onCancel,
  setMethodChange,
}: {
  data: IBooking;
  onSuccess?: () => void;
  onCancel?: () => void;
  setMethodChange?: (val: boolean) => void;
}) {
  const { translate } = useLanguage();
  const [opened, setOpened] = useState(false);
  const [loading, setLoading] = useState(false);
  const isCollateral = data?.merchant._id === "68525eba5518d1717d3ec9c1"
  const { user } = useSelector((state: RootState) => state.auth);
  const formSchema = yup.object().shape({
    method: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    paymentMethod: yup.string().optional(),
    phone: yup.string().when("paymentMethod", {
      is: "STOREPAY",
      then: (schema) =>
        schema.required(
          translate("this_field_is_required", "This field is required"),
        )
          .matches(
            /^([0-9]{8})$/,
            translate("invalid_phone_number", "Invalid phone number")
          ),
      otherwise: (schema) => schema.optional(),
    }),
  });

  const handleApplePayRequest = async () => {
    try {
      setLoading(true);
      const merchantIdentifier = "merchant.bnm.gerbook.webapp";
      // Create payment request for Apple Pay
      const paymentRequest = {
        countryCode: "MN", // Replace with your country code
        currencyCode: "MNT", // Replace with your currency code
        supportedNetworks: ["visa", "masterCard", "amex"],
        displayName: "Gerbook", // Name displayed on the payment sheet
        merchantCapabilities: ["supports3DS"],
        total: {
          label: translate("booking_payment", "Booking Payment"),
          amount: (data.totalAmount + (isCollateral ? 500000 : 0)).toString(),
        },
        lineItems: [
          {
            label: translate("booking_amount", "Booking Amount"),
            amount: (data.amount + (isCollateral ? 500000 : 0)).toString(),
          },
          {
            label: translate("discount", "Discount"),
            amount: data.discount ? `-${data.discount.toString()}` : "0",
          },
        ],
        applicationData: btoa(merchantIdentifier), // Base64 encoded merchant ID
      };

      // Start Apple Pay session
      startApplePaySession(
        paymentRequest,
        // Handle payment authorization
        async (payment) => {
          try {

            // Process payment with your backend
            const res = await orderApi.payWithApplePay(data._id, {
              token: payment.token,
            });

            // Return success status
            return {
              status: 0, // 0 = success
              payment: res,
            };
          } catch (error) {
            console.error("Error processing Apple Pay payment:", error);
            errorParse(error);
            return {
              status: 1, // 1 = failure
              payment: null,
            };
          }
        },
        // Handle payment completion
        (event) => {
          message.success(
            translate("payment_successful", "Payment successful"),
          );
          onSuccess?.();
        },
        // Handle payment failure
        (event) => {
          message.error(translate("payment_failed", "Payment failed"));
        },
      );
    } catch (error) {
      console.error("Error initiating Apple Pay:", error);
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  const cleanError = (message: string) => {
    const prefix = "Validation failed: ";
    return message?.startsWith(prefix) ? message.slice(prefix.length) : message;
  };

  const onSubmit = async (values: any) => {
    setLoading(true);

    const commonFields: any = {
      paymentMethod: values.method,
    };

    if (values.paymentMethod === "STOREPAY") {
      commonFields.phone = values.phone;
    } else {
      commonFields.callbackUri = values.callbackUri;
    }

    try {
      const res = await orderApi.payOrder(data._id, commonFields);
      if (values.paymentMethod === "STOREPAY") {
        if (res?.storepay?.status === "Failed") {
          const rawMessage = res?.storepay?.msgList?.[0]?.text;
          message.error(
            rawMessage ? cleanError(rawMessage) : translate("unauthorized_error", "Error")
          );
          return;
        }
      } else {
        if (res?.golomt?.redirectUri) {
          window.open(res.golomt.redirectUri, "_blank");
        }
      }

      setMethodChange?.(false);
      message.success(
        translate("order_created_successfully", "Order created successfully")
      );
      onSuccess?.();

    } catch (error) {
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Form
        initialValues={{
          method: "",
          callbackUri: "",
          paymentMethod: "",
          phone: "",
        }}
        onSubmit={onSubmit}
        validationSchema={formSchema}
      >
        {({ values, setFieldValues, errors }) => {
          return (
            <div className="space-y-2">
              <fieldset>
                <legend
                  className={cn(
                    "text-sm font-semibold text-gray-900 mb-4",
                    errors.method && "text-red-500"
                  )}
                >
                  {translate("payment_methods", "Payment methods")}
                </legend>
                {values.paymentMethod === "STOREPAY" ? (
                  <div className="grid grid-cols-1 gap-4">
                    <div
                      className={cn(
                        "border rounded-xl p-4 cursor-pointer transition space-y-4",
                        "hover:shadow-md hover:border-blue-400",
                        values.method === "storepay-id"
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <img src="/store-pay.png" alt="store-pay" className="w-6 h-6" />
                        <span className="text-sm font-medium">STORE PAY</span>
                      </div>
                      <NumberField
                        name="phone"
                        label={translate("phone_number", "Phone number")}
                        placeholder="00000000"
                        required
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    {/* <ApplePayButton
                      buttonstyle="black"
                      type="book"
                      locale="en-US"
                      id="applePayButton"
                      onPaymentRequest={handleApplePayRequest}
                    /> */}
                    <PaymentMethodPicker
                      isInvalid={!!errors.method}
                      errorMessage={errors.method}
                      value={values.method}
                      onValueChange={(value, code) => {
                        setFieldValues({
                          method: value,
                          paymentMethod: code,
                          callbackUri:
                            code === "CARD"
                              ? `${window.location.origin}/bookings/${data._id}?thank=true`
                              : "",
                        });
                      }}
                    />
                  </>
                )}
              </fieldset>
              <div className="w-full flex flex-col">
                <div className="w-full flex flex-wrap items-center justify-end gap-3">
                  <div className="flex-shrink-0">
                    <ApplePayButton
                      buttonstyle="black"
                      type="book"
                      locale="en-US"
                      id="applePayButton"
                      onPaymentRequest={handleApplePayRequest}
                    />
                  </div>

                  {data?.status !== BOOKING_STATUS.PENDING && (
                    <Button
                      type="button"
                      variant="bordered"
                      color="danger"
                      onPress={onCancel}
                      className="min-w-[110px]"
                    >
                      {translate("cancel", "Cancel")}
                    </Button>
                  )}

                  {values.paymentMethod === "STOREPAY" && (
                    <Button
                      variant="bordered"
                      onPress={() => {
                        setFieldValues({
                          method: "",
                          paymentMethod: "",
                          callbackUri: "",
                          phone: "",
                        });
                      }}
                      className="min-w-[160px]"
                    >
                      {translate("back_to_register", "Back to register")}
                    </Button>
                  )}

                  {user?.type === UserType.APP_USER && data?.status === BOOKING_STATUS.PENDING && (
                    <Button
                      type="button"
                      variant="bordered"
                      color="danger"
                      onPress={onCancel}
                      className="min-w-[110px]"
                    >
                      {translate("cancel", "Cancel")}
                    </Button>
                  )}

                  <Button
                    type="submit"
                    isLoading={loading}
                    color="primary"
                    className="min-w-[120px]"
                  >
                    {translate("pay_now", "Pay now")}
                  </Button>
                </div>
              </div>

            </div>
          );
        }}
      </Form >

      <Modal isOpen={opened} onOpenChange={setOpened} size="3xl">
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 border-b border-gray-200">
                {translate("cancel_booking", "Cancel booking")}
              </ModalHeader>
              <ModalBody>
                <div className="py-4">
                  <CancelForm
                    data={data}
                    onSuccess={() => {
                      onSuccess?.();
                      setOpened(false);
                    }}
                  />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
