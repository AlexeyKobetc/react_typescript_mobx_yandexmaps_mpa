import { computed, makeObservable, reaction } from "mobx";
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

  get getCurrentAddress() {
    return this.yandexMapsStore.getCurrentAddress;
  }

  get getDestinationAddress() {
    return this.yandexMapsStore.getDestinationAddress;
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
      getIsYmReady: computed,
      getCurrentAddress: computed,
      getDestinationAddress: computed
    });

    reaction(
      () => this.getCurrentAddress,
      () => {
        this.inputsStore.setInputValue("inputSourceAddress", this.getCurrentAddress.fullAddress);
      }
    );

    reaction(
      () => this.getDestinationAddress,
      () => {
        this.inputsStore.setInputValue("inputDestinationAddress", this.getDestinationAddress.fullAddress);
      }
    );
  }

  setYmDiv = (ymContainer: HTMLDivElement) => {
    if (ymContainer) this.yandexMapsStore.setYmDiv(ymContainer);
  };

  setYmInputs = (inputName: string, inputRef: HTMLInputElement) => {
    if (inputRef) this.yandexMapsStore.setYmInputs(inputName, inputRef);
  };

  buttonsHandler = (event: React.MouseEvent<HTMLButtonElement>) => {};
  inputsHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, currentTarget } = event;
    const { name, value } = currentTarget;

    if (type === "change") {
      this.inputsStore.setInputValue(name, value);
    }
  };
}

const context = createContext(new RootStore());

export const useContextYandexMapsStore = () => useContext(context);
