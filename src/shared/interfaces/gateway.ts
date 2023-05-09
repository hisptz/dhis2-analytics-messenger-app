import { IdentifiableModel } from ".";

export interface Gateway extends IdentifiableModel {
  url: string;
  secretKey?: string;
}
