"use client";

/* eslint-disable @next/next/no-img-element */
import { paymentApi } from "@/apis";
import { IBooking } from "@/interfaces/booking";
import { PAYMENT_METHOD, PAYMENT_STATUS } from "@/interfaces/payment";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { errorParse } from "@/utils/error-parse";
import { formatDateTime } from "@/utils/time-age";
import { Button, Chip } from "@heroui/react";
import { IconCheck, IconExclamationCircle } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useSWR, { mutate as mutateSWR } from "swr";
import { PaymentStatus } from "./payment-status";
import { useSocket } from "@/lib/socket/client";
import { QRCodeCanvas } from "qrcode.react";

export const PaymentCheck = ({
  data,
  onSuccess,
  onCancel,
  setMethodChange,
}: {
  data: IBooking;
  onSuccess?: () => void;
  onCancel?: () => void;
  setMethodChange?: (val: boolean) => void;
}) => {
  const socket = useSocket();
  const { translate, currencyRate } = useLanguage();
  const { accessToken } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(false);
  const { data: payment, mutate } = useSWR(
    data.payment ? `/payments/${data.payment._id}` : null,
    () => paymentApi.get(data.payment._id),
    {
      revalidateOnFocus: false,
    },
  );

  const forcePaid = async () => {
    try {
      setLoading(true);
      await paymentApi.paid(data.payment._id);
      // mutate();
      // mutateSWR(`swr.user.${JSON.stringify(accessToken)}`);
      // onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    try {
      setLoading(true);
      const res = await paymentApi.checkPayment(data.payment._id);
      mutate();
      mutateSWR(`swr.user.${JSON.stringify(accessToken)}`);
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setLoading(false);
    }
  };

  const onMethodChange = () => {
    setMethodChange?.(true);
  }

  useEffect(() => {
    if (socket) {
      // Listen for events
      socket.on("action", (data) => {
        if (data.type === "payment.confirmed") {
          mutate();
          onSuccess?.();
        }
      });
    }
  }, [socket, mutate, onSuccess]);

  if (!payment) return null;

  return (
    <div className="flex flex-col gap-2 rounded-lg p-6">
      <div className="flex flex-col items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-sm/6 font-medium text-gray-900">
            <PaymentStatus status={payment.status} />
          </div>
          <div className="flex items-center gap-2">
            <span>{formatDateTime(payment.statusDate)}</span>
          </div>
        </div>
      </div>

      {payment?.status === PAYMENT_STATUS.PAID ? (
        <div className="flex flex-col gap-4">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-green-100">
            <IconCheck aria-hidden="true" className="size-6 text-green-600" />
          </div>
          <div className="mt-3 text-center sm:mt-5">
            <h3 className="text-base font-semibold text-gray-900">
              {translate("payment_successful", "Payment successful")}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {translate(
                  "payment_successful_description",
                  "Your payment has been successfully processed.",
                )}
              </p>
            </div>
          </div>
          {data.cancelRequest ? (
            <>
              <div className="rounded-md bg-yellow-50 p-4 mt-6">
                <div className="flex">
                  <div className="shrink-0">
                    <IconExclamationCircle
                      aria-hidden="true"
                      className="size-5 text-yellow-400"
                    />
                  </div>
                  <div className="ml-3 w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-sm font-medium text-yellow-800">
                        {data.cancelRequest.status === "PENDING"
                          ? translate(
                            "cancel_request_in_progress",
                            "Cancel request in progress",
                          )
                          : translate(
                            "your_booking_is_cancelled",
                            "Your booking is cancelled",
                          )}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Chip color="warning" variant="light">
                          {data.cancelRequest.status}
                        </Chip>
                        <Chip color="warning" variant="light">
                          {formatDateTime(data.cancelRequest.statusDate)}
                        </Chip>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        {data.cancelRequest.status === "PENDING"
                          ? translate(
                            "please_wait_for_the_cancellation_request_to_be_processed",
                            "Please wait for the cancellation request to be processed.",
                          )
                          : ""}
                      </p>
                      <p className="mt-2">
                        {translate("your_note", "Your note:")}
                      </p>
                      <p>{data.cancelRequest.note}</p>
                    </div>
                  </div>
                </div>
              </div>
              {data.cancelRequest.status === "CONFIRMED" && (
                <div className="rounded-md bg-gray-50 p-4 mt-6">
                  <h3 className="text-base/7 font-semibold text-gray-900 mb-4">
                    {translate(
                      "your_booking_is_cancelled",
                      "Your booking is cancelled",
                    )}
                  </h3>
                  <p className="text-sm/6 text-gray-700">
                    {data.cancelRequest.adminNote}
                  </p>
                  <div className="mt-4">
                    <p className="text-sm/6 text-gray-700">
                      {translate("refund_amount", "Refund amount")}:{" "}
                      <span className="text-gray-900 text-lg font-semibold">
                        {currencyRate(data.cancelRequest.refundAmount)}
                      </span>
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-center gap-4">
              <Button
                type="button"
                variant="bordered"
                color="danger"
                onPress={() => {
                  onCancel?.();
                }}
              >
                {translate("cancel", "Cancel")}
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {
            {
              [PAYMENT_METHOD.POCKET]: (
                <div className="flex flex-col items-center gap-4 p-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-[#E33054] flex flex-col items-center space-y-4 w-full max-w-md">
                    <QRCodeCanvas value={payment?.pocket?.qr || ""} size={240} />
                    <img alt="Pocket logo" src="/pocket.png" className="w-24 object-contain" />
                    <p className="text-center text-sm text-gray-800 leading-relaxed">
                      <span className="block font-medium text-base mb-1">
                        {translate("payment_method_title", "You are about to make a payment using the POCKET loan application")}.
                      </span>
                      1. {translate("payment_method_section", "From the payment options section")} <span className="font-semibold text-[#E33054]">Pocket</span>-{translate("г", "in")} {translate("select", "select")}<br />
                      2. {translate("scan_the_displayed_QR_codepocket", "Scan the displayed QR code using the Pocket app")}. <span className="font-semibold text-[#E33054]">Zero</span> {translate("go_to_menu_payment", "Go to the menu and make the payment")}
                    </p>
                  </div>
                </div>
              ),
              [PAYMENT_METHOD.QPAY]: (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${payment?.qpay?.qr_image}`}
                      alt="qr"
                      className="size-60"
                    />
                  </div>
                  <Button
                    as="a"
                    href={payment?.qpay?.qPay_shortUrl}
                    type="button"
                    variant="bordered"
                    color="primary"
                    target="_blank"
                  >
                    {translate("pay_with_bank_apps", "Pay with bank apps")}
                  </Button>
                </div>
              ),
              [PAYMENT_METHOD.WECHAT]: (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className="flex justify-center">
                    <img
                      src={`data:image/png;base64,${payment?.qpay?.qr_image}`}
                      alt="qr"
                      className="size-60"
                    />
                  </div>
                  <Button
                    as="a"
                    href={payment?.qpay?.qPay_shortUrl}
                    type="button"
                    variant="bordered"
                    color="primary"
                    target="_blank"
                  >
                    {translate("pay_with_bank_apps", "Pay with bank apps")}
                  </Button>
                </div>
              ),
              [PAYMENT_METHOD.CARD]: (
                <div className="flex flex-col items-center gap-2 rounded-lg p-6">
                  <div className="w-[60%] bg-white text-green rounded-xl p-4 shadow-lg font-mono border border-[#4135AD]">
                    <div className="flex justify-between items-center mb-4">
                      <div className="text-lg font-semibold tracking-wide">
                        <img alt="" src="/golomt-text-logo.svg" />
                      </div>
                    </div>

                    <div className="text-center my-6">
                      <p className="text-sm text-gray-600">{translate("sub_total", "Sub total")}</p>
                      <p className="text-xl font-bold text-gray-800">{data.payment.currency} {currencyRate(data.payment.amount || 0)}</p>
                    </div>

                    <div className="flex justify-end mt-4">
                      <div className="w-12 h-6 bg-white text-blue-600 text-xs font-bold flex items-center justify-center rounded">
                        {translate("card", "CARD")}
                      </div>
                    </div>
                  </div>
                </div>
              ),
              [PAYMENT_METHOD.STOREPAY]: (
                <div className="flex flex-col items-center gap-4 p-4">
                  <div className="bg-white rounded-xl p-6 shadow-lg border border-[#3B82F6] flex flex-col items-center space-y-4 w-full max-w-md">
                    <img alt="Store Pay logo" src="/store-pay.png" className="w-24 object-contain" />
                    <p className="text-center text-sm text-gray-800 leading-relaxed">
                      <span className="block font-medium text-base mb-1">
                        {translate("payment_store_pay", "You are about to make a payment using the STOREPAY system")}
                      </span>
                      1. {translate("please_enter_the_number_below", "Please enter the number below")} <span className="font-semibold text-[#3B82F6]">Store Pay</span> {translate("confirm_app", "Confirm via the app")}<br />
                      2. {translate("successful_payment_transaction", "After successful payment, your transaction will be automatically recorded")}.
                    </p>
                  </div>
                </div>
              )
            }[payment.method]
          }
          <div className="flex items-center justify-center gap-4 mb-4">
            <Button variant="flat" onPress={onMethodChange} >
              {translate("change_payment_method", "Change payment ")}
            </Button>
            <Button type="button" variant="bordered" onPress={checkPayment} disabled={loading}>
              {translate("check_payment", "Check Payment")}
            </Button>
          </div>
          {/* <div className="flex justify-center">
            <Button type="button" variant="bordered" onPress={forcePaid} disabled={loading}>
              force paid
            </Button>
          </div> */}
        </div>
      )}
    </div>
  );
};
