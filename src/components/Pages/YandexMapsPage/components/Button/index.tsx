import { observer } from "mobx-react";
import { useContextYandexMapsStore } from "../../store/RootStore";

export const Button: React.FC<{ name: string }> = observer(({ name }) => {
  const { getButtons, buttonsHandler } = useContextYandexMapsStore();
  const { labelText, disabled } = getButtons[name];

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
