import React from "react";

export interface GroupProps {
	gatewayType: "whatsapp" | "telegram";
}

export function Group({ gatewayType }: GroupProps) {
	return <div></div>;
}
