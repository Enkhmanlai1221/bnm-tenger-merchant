import numeral from "numeral";

export const formatNumber = (number: number, decimals = 0) =>
  numeral(number).format("0,0." + "0".repeat(decimals));
export const formatPrice = (number: number, decimals = 2) =>
  `${formatNumber(number, decimals)} ₮`;

export const formatPriceWithK = (number: number) => {
  if (number < 1000) return formatPrice(number);

  return `${formatNumber(number / 1000)}K`;
};

export const calculatePercentage = (total: number, value: number) => {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
};
