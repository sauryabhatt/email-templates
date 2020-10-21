/** @format */

import React from "react";
import Checkbox from "./Checkbox";

export default ({ options, ...props }) => {
  let { filterType } = props;
  return (
    <div className="ant-checkbox-group" style={{ display: "block" }}>
      {options.map((label, i) => {
        let checked = false;
        if (
          props[filterType] &&
          props[filterType].length &&
          (props[filterType].includes(label.value) ||
            props[filterType].includes(label.id))
        ) {
          checked = true;
        }

        let name = label.value
          ? label.value.toLowerCase()
          : label.name.toLowerCase();
        if (name.includes("_")) {
          name = name.replace(/_/gi, " ");
        }
        name = name.trim();
        name = name.charAt(0).toUpperCase() + name.slice(1);
        return (
          <Checkbox
            key={`checkbox-${i}`}
            label={name}
            filterId={label.value || label.id}
            filterType={props.filterType}
            disabled={props.disabled}
            handleChange={props.handleChange}
            value={checked}
          />
        );
      })}
    </div>
  );
};
