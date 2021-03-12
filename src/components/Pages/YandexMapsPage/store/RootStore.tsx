import { computed, makeObservable, reaction } from "mobx";
import { createContext, useContext } from "react";
import { checkAddress } from "../components/functions";
import { EYmData, IAddress, ICoordinates } from "../components/types";
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
      () => this.getIsYmReady,
      () => {
        this.setYmInputsDisable(!this.getIsYmReady);
      }
    );

    reaction(
      () => this.getCurrentAddress,
      () => {
        this.inputsStore.setInputValue("inputSourceAddress", this.getCurrentAddress.fullAddress);
        this.inputsStore.setInputValid("inputSourceAddress", true);
      }
    );

    reaction(
      () => this.getDestinationAddress,
      () => {
        this.inputsStore.setInputValue("inputDestinationAddress", this.getDestinationAddress.fullAddress);
        this.inputsStore.setInputValid("inputDestinationAddress", true);
      }
    );

    this.setYmInputsDisable(true);
  }

  setYmInputsDisable = (isDisable: boolean) => {
    Object.keys(this.getInputs).map((inputName: string) => {
      if (this.getInputs[inputName].isYandex) {
        this.inputsStore.setInputDisable(inputName, isDisable);
        isDisable && this.inputsStore.setInputValue(inputName, "");
        isDisable && this.inputsStore.setInputValid(inputName, null);
      }
    });
  };

  setYmDiv = (ymContainer: HTMLDivElement) => {
    if (ymContainer) this.yandexMapsStore.setYmDiv(ymContainer);
  };

  setYmInputs = (inputName: string, inputRef: HTMLInputElement) => {
    if (inputRef) this.yandexMapsStore.setYmInputs(inputName, inputRef);
  };

  checkValueAddress = (inputName: string, address: string) => {
    const region =
      inputName === "inputSourceAddress" ? this.getCurrentAddress.region : this.getDestinationAddress.region;
    const namePosition =
      inputName === "inputSourceAddress" ? EYmData.USER_POSITION : EYmData.DESTINATION_POSITION;

    checkAddress(address, region)
      .then((geoData: any) => {
        const geoObject = geoData.geoObjects.get(0);
        const { description, name, text } = geoObject.properties.getAll();
        const coordinates = geoObject.geometry.getCoordinates();
        const precision = geoObject.properties.get("metaDataProperty.GeocoderMetaData.precision");

        if (precision === "other") {
          this.inputsStore.setInputValid(inputName, false);
        } else {
          this.inputsStore.setInputValue(inputName, text);
          this.inputsStore.setInputValid(inputName, true);

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

  buttonsHandler = (event: React.MouseEvent<HTMLButtonElement>) => {};
  inputsHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, currentTarget } = event;
    const { name, value } = currentTarget;

    if (type === "change") {
      this.inputsStore.setInputValue(name, value);
      this.checkValueAddress(name, value);
    }
  };
}

const context = createContext(new RootStore());

export const useContextYandexMapsStore = () => useContext(context);
