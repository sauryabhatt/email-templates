/** @format */

import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";
import { Input } from "antd";

export default ({ options, ...props }) => {
  let { filterType } = props;
  const [itemsToShow, setItemsToShow] = useState(10);
  const [showMore, setMore] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchVal, setSearchVal] = useState("");

  useEffect(() => {
    setFilteredList(options);
  }, [options]);

  const search = (value) => {
    let filterTable = options.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredList(filterTable);
  };

  const onSearchText = (e) => {
    setSearchVal(e.target.value);
    let { value = "" } = e.target;
    let filterTable = options.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredList(filterTable);
  };

  return (
    <div className="ant-checkbox-group" style={{ display: "block" }}>
      {options.length > 5 && (
        <div className="qa-mar-btm-1 filter-search-box">
          <Input.Search
            placeholder="Search"
            // onSearch={search}
            onChange={onSearchText}
            value={searchVal}
          />
        </div>
      )}
      <div>
        {filteredList.slice(0, itemsToShow).map((label, i) => {
          let checked = false;
          if (
            props[filterType] &&
            props[filterType].length &&
            (props[filterType].includes(label.value) ||
              props[filterType].includes(label.id))
          ) {
            checked = true;
          }
          let name = label?.value
            ? label?.value?.toLowerCase()
            : label?.name?.toLowerCase();
          if (name?.includes("_")) {
            name = name?.replace(/_/gi, " ");
          }
          name = name?.trim();
          name = name?.charAt(0)?.toUpperCase() + name?.slice(1);
          if (!name) {
            return null;
          }
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
      {options.length > itemsToShow && !showMore && (
        <div
          className="qa-sm-color qa-underline qa-cursor qa-mar-btm-1"
          onClick={() => {
            setMore(true);
            setItemsToShow(options.length);
          }}
        >
          View more
        </div>
      )}

      {showMore && (
        <div
          className="qa-sm-color qa-underline qa-cursor qa-mar-btm-1"
          onClick={() => {
            setMore(false);
            setItemsToShow(10);
          }}
        >
          View less
        </div>
      )}
    </div>
  );
};
