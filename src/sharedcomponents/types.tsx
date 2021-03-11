import { ComponentType } from "react";

export interface IPages {
  [name: string]: IPage;
}

export interface IPage {
  path: string;
  component: ComponentType;
  isExact: boolean;
  isActive: boolean;
}
