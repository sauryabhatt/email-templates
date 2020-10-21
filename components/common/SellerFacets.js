/** @format */
import React, { Component } from "react";
import CheckboxGroup from "./CheckboxGroup";
import SortByFilter from "./SortByFilter";
import { Layout, Menu, Button, Switch } from "antd";
import _ from "lodash";
import Router from 'next/router'
const { SubMenu } = Menu;
const { Sider } = Layout;

const OPEN_KEYS = [
  "category",
  "key0",
  "key1",
  "key2",
  "key3",
  "key4",
  "key5",
  "key6",
  "key7",
  "key8",
  "key9",
  "key10",
];

export default class SellerFacets extends Component {
  state = {
    openKeys: OPEN_KEYS,
    query: this.props.queryParams,
    selectedCategory: ["all"],
  };
  baseState = this.state;

  count = 0;

  componentDidMount() {
    let queries = this.props.queryParams;
    if (this.count === 0) {
      for (let list in queries) {
        if (
          list !== "sort_by" &&
          list !== "sort_order" &&
          list !== "size" &&
          list !== "from"
        ) {
          let value = "";
          if (list === "search") {
            value = queries[list];
          } else {
            value = decodeURIComponent(queries[list]);
          }
          value = value.split(",");
          this.setState({ [list]: [...value] });
          this.setState({ query: this.props.queryParams });
        }
        if (list === "f_categories") {
          if (queries[list]) {
            this.setState({ selectedCategory: [queries[list]] });
            this.props.setCategoryName(queries[list]);
          }
        }
      }
      if (!queries.f_categories) {
        this.setState({ selectedCategory: ["all"] });
        this.props.setCategoryName("All Categories");
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.queryParams !== this.props.queryParams) {
      let queries = nextProps.queryParams;
      if (this.count === 0) {
        for (let list in queries) {
          if (
            list !== "sort_by" &&
            list !== "sort_order" &&
            list !== "size" &&
            list !== "from"
          ) {
            let value = "";
            if (list === "search") {
              value = queries[list];
            } else {
              value = decodeURIComponent(queries[list]);
            }
            value = value.split(",");
            this.setState({ [list]: [...value] });
            this.setState({ query: nextProps.queryParams });
          }
          if (list === "f_categories") {
            if (queries[list]) {
              this.setState({ selectedCategory: [queries[list]] });
              this.props.setCategoryName(queries[list]);
            }
          }
        }
        this.count++;
      }
    }
  }

  onOpenChange = (openKeys) =>
    this.setState({ openKeys: [...OPEN_KEYS, ...openKeys] });

  clearFilter = () => {
    this.setState(this.baseState);
    let { facets = [] } = this.props;
    for (let list of facets) {
      if (list["aggregateId"] !== "f_categories") {
        let { aggregateId = "" } = list;
        this.setState({ [aggregateId]: [] });
      } else {
        this.setState({ selectedCategory: this.state["f_categories"] });
      }
    }
    this.props.getFilterData(this.baseState.query, "categories");
  };

  selectCategory = (categoryId) => {
    this.setState({ selectedCategory: [categoryId] });
    let queryParams = this.props.queryParams;
    if (categoryId === "all") {
      delete queryParams.category;
      Router.push("/sellers/" + encodeURIComponent("All Categories"));
    } else {
      queryParams = { ...queryParams, category: categoryId };
      // console.log(encodeURIComponent(categoryId));
      Router.push("/sellers/" + encodeURIComponent(categoryId));
    }
  };

  handleChange = (e) => {
    let { filterId, checked, filterType } = e.target;

    if (checked) {
      if (this.state[filterType] && this.state[filterType].length) {
        this.setState(
          { [filterType]: [...this.state[filterType], filterId] },
          () => {
            this.setQueryParams(this.state, filterType);
          }
        );
      } else {
        this.setState({ [filterType]: [filterId] }, () => {
          this.setQueryParams(this.state, filterType);
        });
      }
    } else {
      if (this.state[filterType] && this.state[filterType].length) {
        let array = [...this.state[filterType]];
        let index = array.indexOf(filterId);
        if (index !== -1) {
          array.splice(index, 1);
          this.setState({ [filterType]: array }, () => {
            this.setQueryParams(this.state, filterType);
          });
        }
      }
    }
  };

  handleSortFilter = (value) => {
    let queryParams = this.props.queryParams;
    if (value === "asc") {
      queryParams = {
        ...queryParams,
        sort_order: "ASC",
        sort_by: "brandName",
        from: 0,
      };
    } else if (value === "desc") {
      queryParams = {
        ...queryParams,
        sort_order: "DESC",
        sort_by: "brandName",
        from: 0,
      };
    } else {
      queryParams = {
        ...queryParams,
        sort_order: "ASC",
        sort_by: value,
        from: 0,
      };
    }
    this.setState({ query: queryParams });
  };

  setQueryParams = (state, filterType) => {
    let queryParams = this.props.queryParams;
    if (this.props.id === "mobile") {
      queryParams = this.state.query;
    }
    if (state[filterType].length) {
      queryParams = {
        ...queryParams,
        [filterType]: state[filterType].join(","),
      };
    } else {
      delete queryParams[filterType];
    }

    this.setState({ query: queryParams });

    if (this.props.id !== "mobile") {
      this.props.getFilterData(queryParams, "filter");
    }
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.getFilterData(this.state.query, "submit");
    this.props.onClose();
  };

  render = () => {
    let { facets = [], categories = {} } = this.props;
    let { aggregateName = "", aggregateList = [] } = categories || {};
    let orderedFacets = _.sortBy(facets, "priority");

    return (
      <Sider
        width={this.props.width || 250}
        style={{
          padding: "0px 30px",
          background: "#f9f7f2",
          marginBottom: "30px",
        }}
        className="site-layout-background"
      >
        {this.props.id === "mobile" && (
          <div style={{ padding: "20px", marginBottom: "20px" }}>
            <div style={{ marginBottom: "20px" }}>
              <span className="filter-title">Filters</span>
              <span className="clear-filter" onClick={() => this.clearFilter()}>
                Clear All
              </span>
            </div>
            <SortByFilter
              width="100%"
              handleSortFilter={this.handleSortFilter}
            />
            {/* <div style={{ marginTop: "30px" }}>
              <span className="qa-pad-rgt-1">Video demo only:</span>
              <Switch
                size="small"
                // defaultChecked
                className="qa-video-check"
              />
            </div> */}
          </div>
        )}
        <form onSubmit={this.handleSubmit} className="qa-facets-form">
          <Menu
            mode="inline"
            className="listing-sidebar"
            openKeys={this.state.openKeys}
            onOpenChange={this.onOpenChange}
            selectedKeys={this.state.selectedCategory}
            style={{ height: "100%", borderRight: 0, background: "#f9f7f2" }}
          >
            <SubMenu key="category" title={aggregateName}>
              <Menu.Item key="all" onClick={() => this.selectCategory("all")}>
                All Categories
              </Menu.Item>
              {_.map(aggregateList, (list, i) => {
                let value = list;
                let name =
                  value.toLowerCase().charAt(0).toUpperCase() + value.slice(1);
                return (
                  <Menu.Item
                    key={value}
                    onClick={() => this.selectCategory(value)}
                  >
                    {name}
                  </Menu.Item>
                );
              })}
            </SubMenu>

            {_.map(orderedFacets, (facet, key) => {
              let {
                aggregateId = "",
                aggregateName = "",
                aggregateList = [],
              } = facet;
              if (aggregateId === "f_categories" && aggregateList.length > 0) {
                return null;
              } else if (aggregateList.length > 0) {
                return (
                  <SubMenu key={`key${key}`} title={aggregateName}>
                    <CheckboxGroup
                      key={key}
                      {...this.state}
                      options={aggregateList}
                      filterType={aggregateId}
                      handleChange={this.handleChange}
                    />
                  </SubMenu>
                );
              }
            })}
          </Menu>

          {this.props.id === "mobile" && (
            <div className="filter-button-section">
              <Button
                onClick={this.props.onClose}
                htmlType="cancel"
                className="qa-button close-button"
              >
                Close
              </Button>
              <Button htmlType="submit" className="qa-button apply-button">
                Apply
              </Button>
            </div>
          )}
        </form>
      </Sider>
    );
  };
}
