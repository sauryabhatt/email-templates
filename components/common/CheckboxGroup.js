/** @format */

import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";
import { Input } from "antd";

export default ({ options, ...props }) => {
  let { filterType } = props;
  const [itemsToShow, setItemsToShow] = useState(5);
  const [showMore, setMore] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [viewAll, setViewAll] = useState(false);

  useEffect(() => {
    let checkedFilters = [];
    let unCheckedFilters = [];
    for (let list of options) {
      if (
        props[filterType] &&
        props[filterType].length &&
        (props[filterType].includes(list.value) ||
          props[filterType].includes(list.id))
      ) {
        checkedFilters.push(list);
      } else {
        unCheckedFilters.push(list);
      }
    }

    checkedFilters = [...checkedFilters, ...unCheckedFilters];
    setFilteredList(checkedFilters);
  }, [options]);

  const onSearchText = (e) => {
    setSearchVal(e.target.value);
    let { value = "" } = e.target;
    let filterTable = options.filter((o) =>
      Object.keys(o).some((k) =>
        String(o[k]).toLowerCase().includes(value.toLowerCase())
      )
    );
    if (filterTable.length === 0) {
      setViewAll(true);
    } else {
      setViewAll(false);
      setItemsToShow(5);
    }
    setFilteredList(filterTable);
  };

  return (
    <div className="ant-checkbox-group" style={{ display: "block" }}>
      {options.length > 5 && (
        <div className="qa-mar-btm-1 filter-search-box">
          <Input.Search
            placeholder="Search"
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
      {filteredList.length > itemsToShow && !showMore && !viewAll && (
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

      {showMore && !viewAll && (
        <div
          className="qa-sm-color qa-underline qa-cursor qa-mar-btm-1"
          onClick={() => {
            setMore(false);
            setItemsToShow(5);
          }}
        >
          View less
        </div>
      )}

      {viewAll && (
        <div
          className="qa-sm-color qa-underline qa-cursor qa-mar-btm-1"
          onClick={() => {
            setFilteredList(options);
            setItemsToShow(options.length);
            setViewAll(false);
          }}
        >
          View all
        </div>
      )}
    </div>
  );
};
