/** @format */

import React from "react";
import { Select } from "antd";

const { Option } = Select;

function SortByFilter(props) {
  let { id = "" } = props;
  if (id === "PLP" || id === "SPLP") {
    return (
      <div className="seller-sort-list">
        <span className="qa-font-san qa-pad-rgt-1">Show by:</span>
        <Select
          defaultValue="popularity"
          dropdownClassName="qa-light-menu-theme"
          style={{ width: props.width || 135, display: "inline-block" }}
          onChange={props.handleSortFilter}
          value={props.queryParams.sort_by}
        >
          <Option value="createdTs">New Arrivals</Option>
          <Option value="minimumOrderQuantity">Order type</Option>
          <Option value="popularity">Popularity</Option>
        </Select>
      </div>
    );
  } else {
    return (
      <div className="seller-sort-list">
        <span className="qa-font-san qa-pad-rgt-1">Show by:</span>
        <Select
          defaultValue="popularity"
          dropdownClassName="qa-light-menu-theme"
          style={{ width: props.width || 120, display: "inline-block" }}
          onChange={props.handleSortFilter}
          value={props.queryParams.sort_by}
        >
          <Option value="publishedTimeStamp">New</Option>
          <Option value="popularity">Popularity</Option>
        </Select>
      </div>
    );
  }
}

export default SortByFilter;
