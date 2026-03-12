interface ApplePayJS {
  ApplePaySession: typeof ApplePaySession;
}

interface Window extends ApplePayJS {}

declare namespace JSX {
  interface IntrinsicElements {
    "apple-pay-button": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
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
      },
      HTMLElement
    >;
  }
}
