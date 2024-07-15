import React from "react";

export interface NavigationItem {
	label?: string;
	path: string;
	icon?: React.JSXElementConstructor<unknown>;
	element: React.JSXElementConstructor<unknown>;
	subItems?: NavigationItem[];
}
