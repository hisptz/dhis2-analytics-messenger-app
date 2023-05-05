import { IdentifiableModel, BaseModel } from ".";

export interface PushAnalytics extends IdentifiableModel {
  gateway: string;
  favorites: Array<Favorite>;
  contacts: Array<Contacts>;
  logs: Array<string>;
  description?: string;
}

export type Favorite = BaseModel;

export type Contacts = BaseModel;
