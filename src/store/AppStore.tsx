import { action, computed, makeObservable, observable } from "mobx";
import { pages } from "../sharedcomponents/initComponents";
import { IPages } from "../sharedcomponents/types";

export class AppStore {
  pages: IPages = pages;
  constructor() {
    makeObservable(this, {
      pages: observable,
      getPages: computed,
      setActivePage: action,
      setActivePath: action
    });
  }

  get getPages() {
    return this.pages;
  }

  setActivePage = (activePageName: string) => {
    Object.keys(this.getPages).map((pageName: string) => {
      this.pages = {
        ...this.pages,
        [pageName]: {
          ...this.pages[pageName],
          isActive: pageName === activePageName ? true : false
        }
      };
    });
  };

  setActivePath = (activePath: string) => {
    Object.keys(this.getPages).map((pageName: string) => {
      const path = this.pages[pageName].path;
      this.pages = {
        ...this.pages,
        [pageName]: {
          ...this.pages[pageName],
          isActive: path === activePath ? true : false
        }
      };
    });
  };
}
