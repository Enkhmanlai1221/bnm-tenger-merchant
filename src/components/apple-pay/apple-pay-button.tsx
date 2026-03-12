"use client";

import { useEffect, useRef } from "react";

interface ApplePayButtonProps {
  buttonstyle?: "black" | "white" | "white-outline";
  type?:
  | "plain"
  | "buy"
  | "setup"
  | "book"
  | "check-out"
  | "order"
  | "donate"
  | "contribute"
  | "tip";
  locale?: string;
  id?: string;
  className?: string;
  onPaymentRequest?: () => void;
}

export function ApplePayButton({
  buttonstyle = "black",
  type = "buy",
  locale = "en-US",
  id = "applePayButton",
  className = "",
  onPaymentRequest,
}: ApplePayButtonProps) {
  const buttonRef = useRef<HTMLElement>(null);
  const buttonWtapperRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // Function to check if the browser is Safari on Apple devices (macOS or iOS)
    function isMacOS() {
      const userAgent = navigator.userAgent;

      // Check for Apple devices (macOS, iOS, iPadOS)
      const isAppleDevice = /Macintosh|iPhone|iPad|iPod/i.test(userAgent);

      // Check for supported browsers (Safari or Chrome)
      const isSupportedBrowser = /AppleWebKit/i.test(userAgent);

      return isAppleDevice && isSupportedBrowser;
    }

    // Only run this code in the browser
    if (typeof window !== "undefined") {
      const button = buttonRef.current;
      const buttonWtapper = buttonWtapperRef.current;
      if (!button || !buttonWtapper) return;

      // Hide button if not on Apple Safari
      if (!isMacOS()) {
        button.style.display = "none";
        buttonWtapper.style.display = "none";
        return;
      }

      // Add click event listener
      const handleClick = () => {
        if (
          window.ApplePaySession &&
          window.ApplePaySession.canMakePayments()
        ) {
          // Call the onPaymentRequest callback if provided
          if (onPaymentRequest) {
            onPaymentRequest();
          }

        } else {
          alert("Apple Pay is not supported on your browser or device.");
        }
      };

      button.addEventListener("click", handleClick);

      // Cleanup
      return () => {
        button.removeEventListener("click", handleClick);
      };
    }
  }, [onPaymentRequest]);

  return (
    <div className="flex flex-col gap-2 w-full h-14" ref={buttonWtapperRef as any}>
      <apple-pay-button
        ref={buttonRef as any}
        buttonstyle={buttonstyle}
        type={type}
        locale={locale}
        id={id}
        className={className}
      />
    </div>
  );
}
