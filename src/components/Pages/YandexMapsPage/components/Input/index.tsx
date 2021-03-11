import React from "react";

import { observer } from "mobx-react";
import { useContextYandexMapsStore } from "../../store/RootStore";

export const Input = observer(({ name }: { name: string }) => {
  const { getInputs, inputsHandler } = useContextYandexMapsStore();
  const {
    textarea,
    labelText,
    placeHolder,
    helpText,
    errorLabel,
    value,
    isValid,
    maxLen,
    regEx,
    isYandex
  } = getInputs[name];
  return (
    <div className="form-floating">
      {textarea ? (
        <textarea
          className={
            "form-control bg-secondary bg-light border-dark text-dark mt-2 mb-2" +
            (isValid !== null ? (isValid ? " is-valid " : " is-invalid ") : "")
          }
          style={{ minHeight: "6rem" }}
          id={name}
          name={name}
          placeholder={placeHolder}
          value={value}
          onFocus={inputsHandler}
          onBlur={inputsHandler}
          onChange={inputsHandler}
        />
      ) : (
        <input
          className={
            "form-control bg-secondary bg-light border-dark text-dark mt-2 mb-2" +
            (isValid !== null ? (isValid ? " is-valid " : " is-invalid ") : "")
          }
          id={name}
          name={name}
          placeholder={placeHolder}
          value={value}
          onFocus={inputsHandler}
          onBlur={inputsHandler}
          onChange={inputsHandler}
        />
      )}
      <label htmlFor={name} className={`form-label ${isValid === false ? "text-danger" : "text-secondary"}`}>
        {isValid === false ? <strong>{isValid === false && errorLabel}</strong> : labelText}
      </label>
    </div>
  );
});
