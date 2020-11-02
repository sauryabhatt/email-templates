/** @format */

import { useState, useEffect } from "react";

export const useQuantity = (defaultQuantity) => {
  const [value, setValue] = useState(defaultQuantity || 1);

  useEffect(() => {
    setValue(defaultQuantity);
  }, [defaultQuantity]);

  const onChange = (e) => {
    if (!+e.target.value >= 1) {
      setValue(1);
      return;
    }
    setValue(+e.target.value);
  };

  return {
    value,
    setvalue: setValue,
    onChange,
  };
};
