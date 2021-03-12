import { action, computed, makeObservable, observable } from "mobx";
import { inputs } from "../components/initComponent";

export class InputsStore {
  inputs = inputs;

  get getInputs() {
    return this.inputs;
  }
  constructor() {
    makeObservable(this, {
      inputs: observable,
      setInputValue: action,
      getInputs: computed
    });
  }

  setInputValue = (inputName: string, value: string) => {
    this.inputs = {
      ...this.inputs,
      [inputName]: {
        ...this.inputs[inputName],
        value
      }
    };
  };

  setInputValid = (inputName: string, isValid: boolean | null) => {
    this.inputs = {
      ...this.inputs,
      [inputName]: {
        ...this.inputs[inputName],
        isValid
      }
    };
  };

  setInputDisable = (inputName: string, isDisable: boolean) => {
    this.inputs = {
      ...this.inputs,
      [inputName]: {
        ...this.inputs[inputName],
        isDisable
      }
    };
  };
}
