/** @format */

import React from "react";
import { Checkbox } from "antd";

export default ({
  disabled,
  label,
  value,
  handleChange,
  filterType,
  filterId,
}) => (
  <Checkbox
    style={{ display: "block", marginLeft: 0 }}
    disabled={disabled || false}
    label={label}
    filterId={filterId}
    filterType={filterType}
    checked={value}
    onChange={handleChange}
  >
    {label}
  </Checkbox>
);
