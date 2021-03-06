import { computed, makeObservable, reaction } from "mobx";
import { createContext, useContext } from "react";
import { checkAddress } from "../components/functions";
import { EYmData } from "../components/types";
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

  get getDefaultAddress() {
    return this.yandexMapsStore.getDefaultAddress;
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
      getDefaultAddress: computed,
      getDestinationAddress: computed
    });

    reaction(
      () => this.getIsYmReady,
      (): void => {
        this.setYmInputsDisable(!this.getIsYmReady);
      }
    );

    reaction(
      () => this.getCurrentAddress,
      (): void => {
        this.inputsStore.setInputValue("inputSourceAddress", this.getCurrentAddress.fullAddress);
        this.inputsStore.setInputValid("inputSourceAddress", true);
      }
    );

    reaction(
      () => this.getDestinationAddress,
      (): void => {
        this.inputsStore.setInputValue("inputDestinationAddress", this.getDestinationAddress.fullAddress);
        this.inputsStore.setInputValid("inputDestinationAddress", true);
      }
    );

    this.setYmInputsDisable(true);
  }

  setYmInputsDisable = (isDisable: boolean): void => {
    Object.keys(this.getInputs).forEach((inputName: string) => {
      if (this.getInputs[inputName].isYandex) {
        this.inputsStore.setInputDisable(inputName, isDisable);
        isDisable && this.inputsStore.setInputValue(inputName, "");
        isDisable && this.inputsStore.setInputValid(inputName, null);
      }
    });
  };

  setYmDiv = (ymContainer: HTMLDivElement): void => {
    if (ymContainer) this.yandexMapsStore.setYmDiv(ymContainer);
  };

  setYmInputs = (inputName: string, inputRef: HTMLInputElement): void => {
    if (inputRef) this.yandexMapsStore.setYmInputs(inputName, inputRef);
  };

  checkValueAddress = (inputName: string, address: string, isBlur: boolean = false): void => {
    let region =
      inputName === "inputSourceAddress" ? this.getCurrentAddress.region : this.getDestinationAddress.region;
    const namePosition =
      inputName === "inputSourceAddress" ? EYmData.USER_POSITION : EYmData.DESTINATION_POSITION;

    if (this.getDestinationAddress.region === this.getDefaultAddress.region)
      region = this.getCurrentAddress.region;

    checkAddress(address, region)
      .then((geoData: any) => {
        const geoObject = geoData.geoObjects.get(0);
        const { description, name, text } = geoObject.properties.getAll();
        const coordinates = geoObject.geometry.getCoordinates();
        const precision = geoObject.properties.get("metaDataProperty.GeocoderMetaData.precision");

        if (precision === "other") {
          this.inputsStore.setInputValid(inputName, false);
        } else {
          this.inputsStore.setInputValid(inputName, true);
          isBlur && this.inputsStore.setInputValue(inputName, text);
          isBlur &&
            this.yandexMapsStore.setPosition(
              namePosition,
              {
                latitude: coordinates[0],
                longitude: coordinates[1]
              },
              { region: description, fullAddress: text, shortAddress: name }
            );
        }
      })
      .catch((error: Error) => console.log(error.message));
  };

  buttonsHandler = (event: React.MouseEvent<HTMLButtonElement>): void => {};
  inputsHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const {
      type,
      currentTarget: { name, value }
    } = event;

    const { maxLen, regEx, isYandex } = this.getInputs[name];

    const isInputValueRegExpValid =
      regEx?.reduce((isValid: boolean, reg: RegExp) => {
        return isValid || reg.test(value.trim());
      }, false) || false;

    if (type === "change") {
      if (value.trim().length < (maxLen || 150)) {
        if (isYandex) {
          this.inputsStore.setInputValue(name, value);
          this.checkValueAddress(name, value);
        } else {
          this.inputsStore.setInputValue(name, value);
          this.inputsStore.setInputValid(name, isInputValueRegExpValid);
        }
      }
    }

    if (type === "blur") {
      if (isYandex) {
        this.inputsStore.setInputValue(name, value);
        this.checkValueAddress(name, value, true);
      }
    }
  };
}

const context = createContext(new RootStore());

export const useContextYandexMapsStore = () => useContext(context);
