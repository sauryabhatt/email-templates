/** @format */

import React, { useState, useEffect } from "react";
import Checkbox from "./Checkbox";
import { Input } from "antd";

const ITEMS_TO_SHOW = 5;
const FIXED_MOQ_FILTERS = [
  "12 & below",
  "24 & below",
  "50 & below",
  "100 & below",
  "200 & below",
  "500 & above",
];

export default ({ options, ...props }) => {
  let { filterType } = props;
  const [itemsToShow, setItemsToShow] = useState(ITEMS_TO_SHOW);
  const [showMore, setMore] = useState(false);
  const [filteredList, setFilteredList] = useState([]);
  const [searchVal, setSearchVal] = useState("");
  const [viewAll, setViewAll] = useState(false);
  const [moqFilter, setMoqFilters] = useState([]);

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

    let moqFilters = [];

    for (let list of options) {
      let { value: name = "" } = list;

      if (
        name === "Bucket-D" ||
        name === "Bucket-F" ||
        name === "Bucket-H" ||
        name === "Bucket-P" ||
        name === "Bucket-Q" ||
        name === "Bucket-R"
      ) {
        moqFilters.push("12 & below");
        moqFilters.push("24 & below");
        moqFilters.push("50 & below");
        moqFilters.push("100 & below");
        moqFilters.push("200 & below");
      } else if (
        name === "Bucket-B" ||
        name === "Bucket-E" ||
        name === "Bucket-G" ||
        name === "Bucket-O"
      ) {
        moqFilters.push("24 & below");
        moqFilters.push("50 & below");
        moqFilters.push("100 & below");
        moqFilters.push("200 & below");
      } else if (
        name === "Bucket-A" ||
        name === "Bucket-C" ||
        name === "Bucket-N"
      ) {
        moqFilters.push("50 & below");
        moqFilters.push("100 & below");
        moqFilters.push("200 & below");
      } else if (name === "Bucket-M") {
        moqFilters.push("100 & below");
        moqFilters.push("200 & below");
      } else if (name === "Bucket-L") {
        moqFilters.push("200 & below");
      } else if (
        name === "Bucket-K" ||
        name === "Bucket-J" ||
        name === "Bucket-I"
      ) {
        moqFilters.push("500 & above");
      }
    }
    moqFilters = _.uniq(moqFilters);
    let filters = FIXED_MOQ_FILTERS.filter((ele) => moqFilters.includes(ele));
    setMoqFilters(filters);
  }, [options]);

  const onSearchText = (e) => {
    setSearchVal(e.target.value);
    let { value = "" } = e.target;
    let filterTable = options.filter((o) =>
      Object.keys(o).some((k) => String(o[k]).includes(value))
    );
    if (filterTable.length === 0) {
      setViewAll(true);
    } else {
      setViewAll(false);
      setItemsToShow(ITEMS_TO_SHOW);
    }
    setFilteredList(filterTable);
  };

  if (props["filterType"] === "f_moqBucket") {
    return (
      <div className="ant-checkbox-group" style={{ display: "block" }}>
        <div>
          {moqFilter.map((label, i) => {
            let checked = false;
            if (
              props[filterType] &&
              props[filterType].length &&
              props[filterType].includes(label)
            ) {
              checked = true;
            }
            return (
              <Checkbox
                key={`checkbox-${i}`}
                label={label}
                filterId={label}
                filterType={props.filterType}
                disabled={props.disabled}
                handleChange={props.handleChange}
                value={checked}
              />
            );
          })}
        </div>
      </div>
    );
  } else {
    return (
      <div className="ant-checkbox-group" style={{ display: "block" }}>
        {options.length > ITEMS_TO_SHOW && (
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
            let name = label?.value ? label?.value : label?.name;
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
              setItemsToShow(ITEMS_TO_SHOW);
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
  }
};
