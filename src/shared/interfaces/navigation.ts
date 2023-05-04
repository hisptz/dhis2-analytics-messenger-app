import React from "react";

export interface NavItem {
  label?: string;
  path: string;
  icon?: React.JSXElementConstructor<any>;
  element: React.JSXElementConstructor<any>;
  subItems?: NavItem[];
}
