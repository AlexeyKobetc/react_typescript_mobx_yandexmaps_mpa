import { computed, makeObservable, observable } from "mobx";
import { inputs } from "./initComponent";

export class InputsStore {
  inputs = inputs;

  get getInputs() {
    return this.inputs;
  }
  constructor() {
    makeObservable(this, {
      inputs: observable,

      getInputs: computed
    });
  }
}
