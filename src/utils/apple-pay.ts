"use client";

// Define ApplePaySession types
declare class ApplePaySession {
  static canMakePayments(): boolean;
  // static canMakePaymentsWithActiveCard(
  //   merchantIdentifier: string,
  // ): Promise<boolean>;
  static supportsVersion(version: number): boolean;

  constructor(version: number, paymentRequest: ApplePayPaymentRequest);

  begin(): void;
  abort(): void;
  completeMerchantValidation(merchantSession: any): void;
  completePayment(status: number): void;
  completePaymentMethodSelection(newTotal: any, newLineItems: any): void;
  completeShippingContactSelection(
    status: number,
    newShippingMethods: any,
    newTotal: any,
    newLineItems: any,
  ): void;
  completeShippingMethodSelection(
    status: number,
    newTotal: any,
    newLineItems: any,
  ): void;

  onvalidatemerchant: (event: { validationURL: string }) => void;
  onpaymentauthorized: (event: { payment: any }) => void;
  onpaymentmethodselected: (event: any) => void;
  onshippingcontactselected: (event: any) => void;
  onshippingmethodselected: (event: any) => void;
  onpaymentcompleted: (event: any) => void;
  oncancel: (event: any) => void;
}

interface ApplePayPaymentRequest {
  countryCode: string;
  currencyCode: string;
  supportedNetworks: string[];
  merchantCapabilities: string[];
  total: {
    label: string;
    amount: string;
  };
  lineItems?: {
    label: string;
    amount: string;
  }[];
}

interface ApplePayPaymentResult {
  status: number;
  payment: any;
}

export const startApplePaySession = (
  paymentRequest: ApplePayPaymentRequest,
  onPaymentAuthorized: (payment: any) => Promise<ApplePayPaymentResult>,
  onPaymentCompleted: (event: any) => void,
  onPaymentFailed: (event: any) => void,
) => {
  if (typeof window === "undefined" || !window.ApplePaySession) {
    console.error("Apple Pay is not available");
    return;
  }

  // Check if we're in a secure context (HTTPS)
  if (window.location.protocol !== "https:") {
    console.error("Apple Pay requires a secure context (HTTPS)");
    alert("Apple Pay requires a secure connection. Please use HTTPS.");
    return;
  }

  // Check if Apple Pay is available
  if (!window.ApplePaySession.canMakePayments()) {
    console.error("Apple Pay is not available on this device");
    return;
  }

  // Create a new Apple Pay session
  const session = new window.ApplePaySession(3, paymentRequest);

  // Validate the merchant during the payment session
  session.onvalidatemerchant = async (event: { validationURL: string }) => {
    try {
      const response = await fetch(
        "https://psp.bonum.mn/api/merchant/validate",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ validationURL: event.validationURL }),
        },
      );
      const merchantSession = await response.json();
      session.completeMerchantValidation(merchantSession);
    } catch (error) {
      console.error("Merchant validation failed:", error);
      session.abort();
    }
  };

  // Handle the payment authorization
  session.onpaymentauthorized = async (event: { payment: any }) => {
    try {
      const result = await onPaymentAuthorized(event.payment);
      session.completePayment(result.status);
    } catch (error) {
      console.error("Error processing Apple Pay payment:", error);
      session.abort();
    }
  };

  // Handle payment completion
  session.onpaymentcompleted = (event: any) => {
    if (onPaymentCompleted) {
      onPaymentCompleted(event);
    }
  };

  // Handle payment failure
  session.oncancel = (event: any) => {
    if (onPaymentFailed) {
      onPaymentFailed(event);
    }
  };

  // Begin the payment session
  session.begin();
};
