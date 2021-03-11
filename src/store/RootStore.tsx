import { createContext, useContext } from "react";
import { YandexMapsStore } from "../components/Pages/YandexMapsPage/store/YandexMapsStore";
import { AppStore } from "./AppStore";

const contextRootStore = createContext({
  appStore: new AppStore(),
  yandexMapsStore: new YandexMapsStore()
});

export const useContextRootStore = () => useContext(contextRootStore);
