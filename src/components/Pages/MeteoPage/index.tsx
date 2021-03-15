import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Loading from "../../../sharedcomponents/Loading";
import {
  renderHeadRow,
  renderIconsRow,
  renderDescriptionRow,
  renderTemperatureRow
} from "./components/functions";

import { useContextMeteoStore } from "./store/RootStore";

const MeteoPage = observer(() => {
  const { getIsFiveDayMeteoLoad, getSlicedFiveDayMeteo, setCountMeteoCellsOnScreen } = useContextMeteoStore();

  const countsMeteoCellsOnScreen = (): void => {
    const widthMeteoCellInPx = 200;
    let countCells = Math.floor(document.body.clientWidth / widthMeteoCellInPx);
    countCells = countCells < 3 ? 3 : countCells;
    setCountMeteoCellsOnScreen(countCells);
  };

  useEffect(() => {
    countsMeteoCellsOnScreen();

    window.addEventListener("resize", countsMeteoCellsOnScreen);
    return () => {
      window.removeEventListener("resize", countsMeteoCellsOnScreen);
    };
  });

  return (
    <React.Fragment>
      {!getIsFiveDayMeteoLoad ? (
        <Loading text={`Загружается прогноз погоды ...`} />
      ) : (
        <React.Fragment>
          <div className="row justify-content-center align-items-center">
            <div className="col d-flex flex-column justify-content-center align-items-center m-4">
              <h1 className="text-secondary"> {`Прогноз погоды`} </h1>
              <h5 className="text-secondary text-muted"> {`Анапа`} </h5>
            </div>
          </div>

          <div className="row justify-content-center align-items-center">
            <div className="col-12 col-sm-11 mt-5 mb-5">
              <table className="table">
                <thead>
                  <tr>{renderHeadRow(getSlicedFiveDayMeteo)}</tr>
                </thead>
                <tbody>
                  <tr>{renderIconsRow(getSlicedFiveDayMeteo)}</tr>
                  <tr>{renderDescriptionRow(getSlicedFiveDayMeteo)}</tr>
                  <tr>{renderTemperatureRow(getSlicedFiveDayMeteo)}</tr>
                </tbody>
              </table>
            </div>
          </div>
        </React.Fragment>
      )}
    </React.Fragment>
  );
});

export default MeteoPage;
