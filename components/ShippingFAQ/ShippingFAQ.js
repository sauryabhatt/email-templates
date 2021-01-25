/** @format */

import React, { useState, useEffect } from "react";
import Spinner from "../Spinner/Spinner";

export default function ShippingFAQforwholesalebuyers() {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useState(() => {
    fetch(
      process.env.NEXT_PUBLIC_REACT_APP_CONTENT_URL + "/content/ShippingFAQ",
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_ANONYMOUS_TOKEN,
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw res.statusText || "Content not found";
        }
      })
      .then((res) => {
        setHtmlContent(res.body);
        setLoading(false);
      })
      .catch((error) => {
        // message.error(error)
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <React.Fragment>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }}></div>
    </React.Fragment>
  );
}
