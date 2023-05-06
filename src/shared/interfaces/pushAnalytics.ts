import { IdentifiableModel, BaseModel, Visualization } from ".";

export interface PushAnalytics extends IdentifiableModel {
  gateway: string;
  visualizations: Array<Visualization>;
  contacts: Array<Contacts>;
  logs?: Array<string>;
  description?: string;
}

export type Contacts = BaseModel;
