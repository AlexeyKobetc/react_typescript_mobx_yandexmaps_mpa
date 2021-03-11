import { computed, makeObservable } from "mobx";
import { createContext, useContext } from "react";
import { ButtonsStore } from "./buttonsStore";
import { InputsStore } from "./InputsStore";
import { YandexMapsStore } from "./YandexMapsStore";

class RootStore {
  inputsStore = new InputsStore();
  buttonsStore = new ButtonsStore();
  yandexMapsStore = new YandexMapsStore();

  get getIsYmReady() {
    return this.yandexMapsStore.isYmReady;
  }

  get getInputs() {
    return this.inputsStore.getInputs;
  }

  get getButtons() {
    return this.buttonsStore.getButtons;
  }

  constructor() {
    makeObservable(this, {
      getInputs: computed,
      getButtons: computed,
      getIsYmReady: computed
    });
  }

  setYmDiv = (ymContainer: HTMLDivElement) => {
    if (ymContainer) this.yandexMapsStore.setYmDiv(ymContainer);
  };

  buttonsHandler = (event: React.MouseEvent<HTMLButtonElement>) => {};
  inputsHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, currentTarget } = event;
    const { name, value } = currentTarget;

    if (type === "change") {
      console.log(name, value);
    }
  };
}

const context = createContext(new RootStore());

export const useContextYandexMapsStore = () => useContext(context);
