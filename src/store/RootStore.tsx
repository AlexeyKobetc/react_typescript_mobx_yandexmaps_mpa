import { createContext, useContext } from "react";
import { AppStore } from "./AppStore";
import { YandexMapsStore } from "../components/Pages/YandexMapsPage/YandexMapsStore";

const contextRootStore = createContext({
  appStore: new AppStore(),
  yandexMapsStore: new YandexMapsStore()
});

export const useContextRootStore = () => useContext(contextRootStore);
