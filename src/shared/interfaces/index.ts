export * from "./visualization";
export * from "./pushAnalytics";
export * from "./gateway";
export * from "./navigation";

// Base models
export interface BaseModel {
  id: String;
  name: string;
}

export interface IdentifiableModel extends BaseModel {
  created: string;
  lastUpdated: string;
  createdBy: string;
}
