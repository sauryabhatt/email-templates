/** @format */

// import _ from "lodash";
// import ndjsonStream from "can-ndjson-stream";

export const fetchHeader = async () => {
  // let navigationDetails = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_REACT_APP_API_PROFILE_URL + "/shop-option-list"
  );
  // const exampleReader = ndjsonStream(response.body).getReader();
  // let result;
  // while (!result || !result.done) {
  //   result = await exampleReader.read();

  //   if (!result.done) navigationDetails.push(result.value);
  //   // console.log(result.done, result.value); //result.value is one line of your NDJSON data
  // }

  // let navigationItems = _.mapValues(
  //   _.groupBy(navigationDetails, "column"),
  //   (clist) => clist.map((navigationDetails) => navigationDetails)
  // );
  // setNavigationItems(navigationItems);
  // let columnLength = Object.keys(navigationItems).length;
  // setColumns(columnLength);
  return response;
};
