import { makeObservable } from "mobx";
import { createContext, useContext } from "react";
import { InputsStore } from "./InputsStore";
import { YandexMapsStore } from "./YandexMapsStore";

class RootStore {
  inputsStore = new InputsStore();
  yandexMapsStore = new YandexMapsStore();

  constructor() {
    makeObservable(this, {});
  }
}

const context = createContext({
  rootStore: new RootStore()
});

export const useContextYandexMapsStore = () => useContext(context);
