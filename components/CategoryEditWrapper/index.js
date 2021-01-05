/** @format */

import React from "react";
import { useCookies } from "react-cookie";
import FeedbackModal from "../FeedbackModal/FeedbackModal";

function CategoryEditWrapper({ body }) {
  const [cookie, setCookie] = useCookies(["qalaraUser"]);

  return (
    <div>
      {/*cookie.qalaraUser && cookie.qalaraUser !== "oldUser" && (
        <FeedbackModal />
      )*/}
      <div dangerouslySetInnerHTML={{ __html: body }}></div>
    </div>
  );
}

export default CategoryEditWrapper;
