import { computed, makeObservable, observable } from "mobx";
import { buttons } from "../components/initComponent";

export class ButtonsStore {
  buttons = buttons;

  get getButtons() {
    return this.buttons;
  }
  constructor() {
    makeObservable(this, {
      buttons: observable,

      getButtons: computed
    });
  }
}
