import React from "react";
import { useContextYandexMapsStore } from "../../store/RootStore";
import { Input } from "../Input";

export const OrderForm = () => {
  const { getInputs } = useContextYandexMapsStore();

  return (
    <React.Fragment>
      {Object.keys(getInputs).map((inputName: string, index: number) => {
        return <Input name={inputName} key={`${inputName}____${index}`} />;
      })}
    </React.Fragment>
  );
};
