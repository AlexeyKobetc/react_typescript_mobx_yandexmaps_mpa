import { IButtons, IInputs } from "../components/types";

export const inputs: IInputs = {
  inputSourceAddress: {
    textarea: false,
    labelText: "Откуда Вас забрать.",
    placeHolder: "Откуда Вас забрать.",
    helpText: "Введите адрес откуда Вас забрать.",
    errorLabel: "Уточните адрес",
    value: "",
    isValid: null,
    isDisable: false,
    maxLen: 150,
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
    isDisable: false,
    maxLen: 150,
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
    isDisable: false,
    maxLen: 50,
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
    isDisable: false,
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
    isDisable: false,
    maxLen: 250,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,?!\-\n\r ]+$/],
    isYandex: false
  }
};

export const buttons: IButtons = {
  ok: {
    labelText: "Заказать",
    disabled: false
  },
  help: {
    labelText: "Инструкция",
    disabled: false
  }
};

export const initYmData = {
  defaultPosition: {
    coordinates: { latitude: 56.85, longitude: 60.65 },
    address: {
      region: "Россия, Свердловская область, Екатеринбург",
      fullAddress:
        "Россия, Свердловская область, Екатеринбург, Кировский район, микрорайон Втузгородок, Академическая улица, 16",
      shortAddress: "Академическая улица, 16"
    }
  },
  userPosition: {
    coordinates: { longitude: 0, latitude: 0 },
    address: {
      region: "",
      fullAddress: "",
      shortAddress: ""
    }
  },
  destinationPosition: {
    coordinates: { longitude: 0, latitude: 0 },
    address: {
      region: "",
      fullAddress: "",
      shortAddress: ""
    }
  }
};

export const initYmUserGeoMarker = {
  ymGeoMarker: null,
  icon: "islands#darkGreenStretchyIcon",
  id: "userGeoMarker",
  labelTextHeader: "Вы здесь: "
};
export const initYmDestinationGeoMarker = {
  ymGeoMarker: null,
  icon: "islands#yellowStretchyIcon",
  id: "destinationGeoMarker",
  labelTextHeader: "Вам нужно сюда: "
};
