/** @format */

import React, { useState, useEffect } from "react";
import { useQuantity } from "./useQuantity";
import { Button, Input } from "antd";

export const QuantityInput = (props) => {
  const [value, setValue] = useState(props.quantity || 1);

  useEffect(() => {
    setValue(+props.quantity);
    if (props.maxQty) {
      quantity.setvalue(props.maxQty);
    }
  }, [props]);

  const quantity = useQuantity(value); // Use quantity here, do not need to pass from props

  let { minQty = 1, name = "", enableUpdateQty, sellerCode = "" } = props;
  const [error, setError] = useState(false);

  const decrement = () => {
    if (quantity.value - 1 >= minQty) {
      enableUpdateQty(sellerCode);
      setError(false);
    } else {
      enableUpdateQty("");
      setError(true);
    }
    quantity.setvalue(quantity.value - 1);
  };

  const increment = () => {
    if (quantity.value + 1 >= minQty) {
      enableUpdateQty(sellerCode);
      setError(false);
    } else {
      enableUpdateQty("");
      setError(true);
    }
    quantity.setvalue(quantity.value + 1);
  };

  const onChange = (e) => {
    if (e.target.value >= minQty) {
      enableUpdateQty(sellerCode);
      setError(false);
    } else {
      enableUpdateQty("");
      setError(true);
    }
    quantity.onChange(e);
    quantity.setvalue(+e.target.value);
  };

  return (
    <div>
      <Button
        onClick={decrement}
        disabled={quantity.value === minQty}
        shape="circle"
        className="add-dec-btn qty-update-btn"
      >
        -
      </Button>
      <Input
        className="qa-disp-inline qty-update-input"
        value={quantity.value}
        maxLength="8"
        onChange={onChange}
        type="number"
        id={name}
      />
      <Button
        onClick={increment}
        shape="circle"
        className="add-dec-btn qty-update-btn"
      >
        {" "}
        +{" "}
      </Button>
      {error && (
        <div className="qa-error">
          Please add quantity greater than {minQty}
        </div>
      )}
    </div>
  );
};
