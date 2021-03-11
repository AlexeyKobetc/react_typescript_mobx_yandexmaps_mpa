import { IInputs } from "./types";

export const inputs: IInputs = {
  inputSourceAddress: {
    textarea: false,
    labelText: "Откуда Вас забрать.",
    placeHolder: "Откуда Вас забрать.",
    helpText: "Введите адрес откуда Вас забрать.",
    errorLabel: "Уточните адрес",
    value: "",
    isValid: null,
    maxLen: 250,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,\- ]+$/],
    isYandex: true
  },
  inputDestinationAddress: {
    textarea: false,
    labelText: "Куда Вы поедете.",
    placeHolder: "Куда Вы поедете.",
    helpText: "Введите адрес куда Вы поедете.",
    errorLabel: "Уточните адрес",
    value: "",
    isValid: null,
    maxLen: 250,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,\- ]+$/],
    isYandex: true
  },
  inputName: {
    textarea: false,
    labelText: "Ваше имя.",
    placeHolder: "Ваше имя.",
    helpText: "Как к Вам обращаться.",
    errorLabel: "Уточните имя",
    value: "",
    isValid: null,
    maxLen: 150,
    regEx: [/^[\u0400-\u04FF ]+$/],
    isYandex: false
  },
  inputPhone: {
    textarea: false,
    labelText: "Ваш E-Mail или номер телефона",
    placeHolder: "Ваш E-Mail или номер телефона",
    helpText: "Введите вашу электронную почту или номер телефона.",
    errorLabel: "name@server.com или +7XXXXXXXXXX",
    value: "",
    isValid: null,
    maxLen: 50,
    regEx: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      /^((\+7|7|8)+([0-9]){10})$/
    ],
    isYandex: false
  },
  inputComment: {
    textarea: true,
    labelText: "Комментарий для водителя",
    placeHolder: "Комментарий для водителя",
    helpText: "Если есть особые пожелания, напишите их здесь.",
    errorLabel:
      "  Комментарий может содержать только русские или латинские символы, цифры и знаки пунктуации.",
    value: "",
    isValid: null,
    maxLen: 250,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,?!\-\n\r ]+$/],
    isYandex: false
  }
};
