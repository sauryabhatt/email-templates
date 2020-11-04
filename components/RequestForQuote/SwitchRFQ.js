import React from "react";
import { useSelector } from "react-redux";

import RequestForQuote from "./RequestForQuote";
import UserRequestForQuote from "./UserRequestForQuote";

export default function SwitchRFQ(){
	const isAuthenticated = useSelector((state) => state.auth.authenticated);
	return (
		(isAuthenticated) ? 
		<UserRequestForQuote /> : <RequestForQuote />
	)
}