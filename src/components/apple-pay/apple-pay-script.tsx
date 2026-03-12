"use client";

import Script from "next/script";

export function ApplePayScript() {
  return (
    <Script
      src="https://applepay.cdn-apple.com/jsapi/v1/apple-pay-sdk.js"
      strategy="afterInteractive"
    />
  );
}
