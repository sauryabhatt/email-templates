/** @format */
import React, { Component } from "react";
import { connect } from "react-redux";
import CheckboxGroup from "./CheckboxGroup";
import SortByFilter from "./SortByFilter";
import { Layout, Menu, Button, Input } from "antd";
import getSymbolFromCurrency from "currency-symbol-map";
import { getCurrencyConversion } from "../../store/actions";
import Router from "next/router";
import _ from "lodash";

const { SubMenu } = Menu;
const { Sider } = Layout;

const OPEN_KEYS = [
  "category",
  "price",
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
  "key11",
  "key12",
  "key13",
  "key14",
  "key15",
];

class ProductFacets extends Component {
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
    if (this.props.id === "mobile") {
      this.props.onClose();
    }
    this.props.getFilterData(this.baseState.query, "clear");
  };

  selectCategory = (categoryId) => {
    this.setState({ selectedCategory: [categoryId] });
    let { pageId = "", queryParams = "", sellerId = "" } = this.props;
    if (categoryId === "all") {
      delete queryParams.category;
      if (pageId === "product-listing") {
        Router.push("/products/all-categories");
      } else {
        Router.push("/seller/" + sellerId + "/" + "all-categories");
      }
    } else {
      queryParams = { ...queryParams, category: categoryId };
      if (pageId === "product-listing") {
        Router.push("/products/" + categoryId);
      } else {
        Router.push("/seller/" + sellerId + "/" + categoryId);
      }
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
    if (value === "createdTs") {
      queryParams = {
        ...queryParams,
        sort_order: "DESC",
        sort_by: "createdTs",
        from: 0,
      };
    } else if (value === "minimumOrderQuantity") {
      queryParams = {
        ...queryParams,
        sort_order: "ASC",
        sort_by: "minimumOrderQuantity",
        from: 0,
      };
    } else {
      queryParams = {
        ...queryParams,
        sort_order: "DESC",
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

  onChange = (e) => {
    let { id = "", value } = e.target;
    if (isNaN(value)) {
      if (id === "startPrice") {
        this.setState({ toPriceError: "Price should be number" });
      } else {
        this.setState({ fromPriceError: "Price should be number" });
      }
      this.setState({ priceError: "Price should be number" });
    } else {
      this.setState({ [id]: value });
      this.setState({ priceError: "" });
      this.setState({ fromPriceError: "" });
      this.setState({ toPriceError: "" });

      if (this.props.id === "mobile") {
        let queryParams = this.state.query;
        queryParams = {
          ...queryParams,
          [id]: value,
        };
        this.setState({ query: queryParams });
      }
    }
  };

  priceFilter = () => {
    let { startPrice = "", endPrice = "" } = this.state;
    let { convertToCurrency = "" } = this.props.currencyDetails;

    if (parseInt(startPrice) > parseInt(endPrice)) {
      this.setState({ priceError: "From price is greater than to price" });
    } else {
      if (convertToCurrency !== "USD") {
        this.props.getCurrencyConversion(convertToCurrency, (res) => {
          let { rates = [] } = res;
          let convertedStartPrice = Number.parseFloat(
            startPrice * rates["USD"]
          ).toFixed(0);
          let convertedEndPrice = Number.parseFloat(
            endPrice * rates["USD"]
          ).toFixed(0);

          let queryParams = this.props.queryParams;
          queryParams = {
            ...queryParams,
            startPrice: convertedStartPrice,
            endPrice: convertedEndPrice,
          };
          if (!startPrice && !endPrice) {
            delete queryParams["startPrice"];
            delete queryParams["endPrice"];
          }
          this.props.getFilterData(queryParams, "filter");
          this.setState({ priceError: "" });
        });
      } else {
        let queryParams = this.props.queryParams;
        queryParams = {
          ...queryParams,
          startPrice: startPrice,
          endPrice: endPrice,
        };
        if (!startPrice && !endPrice) {
          delete queryParams["startPrice"];
          delete queryParams["endPrice"];
        }
        this.props.getFilterData(queryParams, "filter");
        this.setState({ priceError: "" });
      }
    }
  };
  render = () => {
    let {
      facets = [],
      categories = {},
      currencyDetails = {},
      pageId = "",
    } = this.props;

    let { convertToCurrency = "" } = currencyDetails;

    let dynamicCategories = [];

    if (pageId === "product-listing") {
      dynamicCategories = categories;
    } else {
      if (facets && facets.length) {
        for (let list of facets) {
          if (list["aggregateId"] === "f_categories") {
            let {
              aggregateId = "",
              aggregateList = [],
              aggregateName = "",
              priority = 0,
            } = list;
            let obj = {};
            obj["aggregateId"] = aggregateId;
            obj["aggregateName"] = aggregateName;
            obj["priority"] = priority;

            let categoryList = [];

            for (let category of aggregateList) {
              let catObj = {};
              let { value = "", count = "" } = category;
              catObj["name"] = value;

              switch (value) {
                case "Baby & Kids":
                  catObj["value"] = "baby-and-kids";
                  break;
                case "Fashion":
                  catObj["value"] = "fashion";
                  break;
                case "Furniture & Storage":
                  catObj["value"] = "furniture-and-storage";
                  break;
                case "Home Décor & Accessories":
                  catObj["value"] = "home-decor-and-accessories";
                  break;
                case "Home Furnishing":
                  catObj["value"] = "home-furnishing";
                  break;
                case "Jewelry":
                  catObj["value"] = "jewelry";
                  break;
                case "Kitchen & Dining":
                  catObj["value"] = "kitchen-and-dining";
                  break;
                case "Pets Essentials":
                  catObj["value"] = "pets-essentials";
                  break;
                case "Stationery & Novelty":
                  catObj["value"] = "stationery-and-novelty";
                  break;
                default:
                  catObj["value"] = "all-categories";
                  break;
              }

              catObj["count"] = count;
              categoryList.push(catObj);
            }

            obj["aggregateList"] = categoryList;
            dynamicCategories = obj;
          }
        }
      }
    }

    let { aggregateName = "", aggregateLists = [], aggregateList = [] } =
      dynamicCategories || {};
    aggregateLists = _.orderBy(aggregateLists, ["key"], ["asc"]);
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
              id="PLP"
              queryParams={this.props.queryParams}
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
              {pageId === "product-listing"
                ? _.map(aggregateLists, (list, i) => {
                    let value = list.value;
                    let name = list.key;
                    return (
                      <Menu.Item
                        key={value}
                        onClick={() => this.selectCategory(value)}
                      >
                        {name}
                      </Menu.Item>
                    );
                  })
                : _.map(aggregateList, (list, i) => {
                    // let value = list.value;
                    // let name =list.key;
                    return (
                      <Menu.Item
                        key={list.value}
                        onClick={() => this.selectCategory(list.value)}
                      >
                        {list.name}
                      </Menu.Item>
                    );
                  })}
            </SubMenu>

            {this.props.id !== "mobile" && (
              <div className="qa-mar-btm-2">
                <span className="filter-title">FILTERS</span>
                <span
                  className="clear-filter"
                  onClick={() => this.clearFilter()}
                >
                  Clear All
                </span>
              </div>
            )}

            {_.map(orderedFacets, (facet, key) => {
              let {
                aggregateId = "",
                aggregateName = "",
                aggregateList = [],
              } = facet;
              if (aggregateId === "f_categories" && aggregateList.length > 0) {
                return null;
              } else if (
                aggregateId === "exfactoryListPrice" &&
                aggregateList.length > 0
              ) {
                return (
                  <SubMenu
                    key="price"
                    title={`Price ${getSymbolFromCurrency(convertToCurrency)}`}
                  >
                    <div className="qa-mar-top-1 price-filter">
                      <div className="qa-mar-btm-1 qa-disp-ib-price">
                        {/* <div className="ant-menu ant-menu-sub ant-menu-inline">
                          From
                        </div> */}
                        <Input
                          className={
                            this.state.fromPriceError ? "error-border" : ""
                          }
                          id="startPrice"
                          onChange={this.onChange}
                          placeholder="FROM"
                          style={{
                            width: 120,
                            height: "42px",
                            marginBottom: "10px",
                            background: "transparent",
                          }}
                        />
                      </div>
                      <div className="qa-mar-btm-1 qa-disp-ib-price">
                        {/* <div className="ant-menu ant-menu-sub ant-menu-inline">
                          To
                        </div> */}
                        <Input
                          className={
                            this.state.toPriceError ? "error-border" : ""
                          }
                          id="endPrice"
                          onChange={this.onChange}
                          placeholder="TO"
                          style={{
                            width: 120,
                            height: "42px",
                            marginBottom: "10px",
                            background: "transparent",
                          }}
                        />
                        {this.props.id !== "mobile" && (
                          <Button
                            onClick={this.priceFilter}
                            className="qa-button price-button"
                          >
                            Go
                          </Button>
                        )}
                      </div>
                      <div className="qa-text-error qa-mar-btm-2">
                        {this.state.priceError}
                      </div>
                    </div>
                  </SubMenu>
                );
              } else if (
                aggregateId === "f_moqBucket" &&
                aggregateList.length > 0
              ) {
                return (
                  <SubMenu key={`key${key}`} title="Minimum order quantity">
                    <CheckboxGroup
                      key={key}
                      {...this.state}
                      options={aggregateList}
                      filterType={aggregateId}
                      handleChange={this.handleChange}
                    />
                  </SubMenu>
                );
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

const mapStateToProps = (state) => {
  return {
    currencyDetails: state.currencyConverter,
  };
};

export default connect(mapStateToProps, { getCurrencyConversion })(
  ProductFacets
);
