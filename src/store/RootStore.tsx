import { createContext, useContext } from "react";

import { AppStore } from "./AppStore";

const contextRootStore = createContext({
  appStore: new AppStore()
});

export const useContextRootStore = () => useContext(contextRootStore);
