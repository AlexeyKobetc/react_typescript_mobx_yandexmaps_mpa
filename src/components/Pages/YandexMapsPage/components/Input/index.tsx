import React, { useEffect, useRef } from "react";

import { observer } from "mobx-react";
import { useContextYandexMapsStore } from "../../store/RootStore";

export const Input: React.FC<{ name: string }> = observer(({ name }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { getInputs, inputsHandler, setYmInputs } = useContextYandexMapsStore();
  const {
    textarea,
    labelText,
    placeHolder,
    helpText,
    errorLabel,
    value,
    isValid,
    isDisable,
    maxLen,
    regEx,
    isYandex
  } = getInputs[name];

  useEffect(() => {
    if (isYandex && inputRef.current) {
      setYmInputs(name, inputRef.current);
    }
  });

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
          disabled={isDisable}
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
          disabled={isDisable}
          value={value}
          onFocus={inputsHandler}
          onBlur={inputsHandler}
          onChange={inputsHandler}
          ref={inputRef}
        />
      )}
      <label htmlFor={name} className={`form-label ${isValid === false ? "text-danger" : "text-secondary"}`}>
        {isValid === false ? <strong>{isValid === false && errorLabel}</strong> : labelText}
      </label>
    </div>
  );
});
