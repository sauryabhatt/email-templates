/** @format */
import React, { useState, useEffect } from "react";
import { Select } from "antd";
import { connect } from "react-redux";
import { getCurrencyConversion, getCurrentFormat } from "../../store/actions";

const { Option } = Select;

function CurrencyConverter(props) {
  const [baseCurrency, setBaseCurrency] = useState("USD");

  useEffect(() => {
    props.getCurrencyConversion(baseCurrency);
    let currencySelected = sessionStorage.getItem("CURRENCY_SELECTED") || "USD";
    props.getCurrentFormat(currencySelected);
  }, []);

  const changeConvertToCurrency = (value) => {
    sessionStorage.setItem("CURRENCY_SELECTED", value);
    props.getCurrentFormat(value);
  };

  let { currencies = [], convertToCurrency = "USD" } = props.data;
  let { mobile = false } = props;

  let currencyChoice = [];
  let currencyOptions = [];

  if (currencies.length) {
    currencies = currencies.filter((currency) => {
      if (
        currency === "GBP" ||
        currency === "EUR" ||
        currency === "AUD" ||
        currency === "USD"
      ) {
        return true;
      }
    });
    currencyChoice = currencies.map((currency) => (
      <Option key={currency} value={currency}>
        {currency}
      </Option>
    ));
    currencyOptions = currencies.map((currency) => (
      <div
        key={currency}
        onClick={() => {
          changeConvertToCurrency(currency);
        }}
      >
        {currency}
      </div>
    ));
  }

  if (mobile) {
    return <div className="currency-conversion-block">{currencyOptions}</div>;
  } else {
    return (
      <div
        style={{ display: "inline-block", marginRight: "15px" }}
        className="currency-conversion-block"
      >
        <Select
          className="qa-dark-menu-theme currency-converter"
          dropdownClassName="qa-dark-menu-theme currency-converter"
          value={convertToCurrency}
          onChange={changeConvertToCurrency}
        >
          {currencyChoice}
        </Select>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.currencyConverter,
  };
};

export default connect(mapStateToProps, {
  getCurrencyConversion,
  getCurrentFormat,
})(CurrencyConverter);
