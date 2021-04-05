/** @format */

export const getConvertedCurrency = (
  baseAmount,
  currencyDetails,
  roundOff = false
) => {
  let { convertToCurrency = "", rates = [] } = currencyDetails || {};
  if (roundOff) {
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(0);
  } else {
    return Number.parseFloat(baseAmount * rates[convertToCurrency]).toFixed(2);
  }
};
