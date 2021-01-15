/** @format */

import React, { useEffect } from "react";
import { useRouter } from "next/router";

const CheckUserStatus = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/");
  }, []);

  return <div id="check-user-status"></div>;
};

export default CheckUserStatus;
