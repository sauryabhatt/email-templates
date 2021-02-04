/** @format */

export const getConvertedCurrency = (
  baseAmount,
  currencyDetails,
  roundOff = false
) => {
  let { convertToCurrency = "", rates = [] } = currencyDetails || {};
  if (roundOff) {
    return Number.parseFloat(
      (baseAmount *
        Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
        100
    ).toFixed(0);
  } else {
    return Number.parseFloat(
      (baseAmount *
        Math.round((rates[convertToCurrency] + Number.EPSILON) * 100)) /
        100
    ).toFixed(2);
  }
};
