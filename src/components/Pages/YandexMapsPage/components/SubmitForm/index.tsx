import React from "react";
import { useContextYandexMapsStore } from "../../store/RootStore";
import { Button } from "../Button";

export const SubmitForm = () => {
  const { getButtons } = useContextYandexMapsStore();

  return (
    <React.Fragment>
      {Object.keys(getButtons).map((buttonName: string, index: number) => {
        return (
          <div className="col-12 col-sm-4 d-grid" key={`${buttonName}_____${index}`}>
            <Button name={buttonName} />
          </div>
        );
      })}
    </React.Fragment>
  );
};
