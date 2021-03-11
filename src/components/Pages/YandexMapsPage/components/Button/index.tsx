import { observer } from "mobx-react";
import { useContextYandexMapsStore } from "../../store/RootStore";

export const Button = observer(({ name }: { name: string }) => {
  const { getButtons, buttonsHandler } = useContextYandexMapsStore();
  const { labelText, disabled } = getButtons[name];

  console.log(labelText, disabled);
  return (
    <button
      disabled={disabled}
      className="btn btn-outline-secondary mt-2 mb-2"
      id={name}
      name={name}
      onClick={buttonsHandler}
    >
      {labelText}
    </button>
  );
});
