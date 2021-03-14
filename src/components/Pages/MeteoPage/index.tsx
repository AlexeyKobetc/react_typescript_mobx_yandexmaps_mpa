import { observer } from "mobx-react";
import React, { useEffect } from "react";
import Loading from "../../../sharedcomponents/Loading";
import { IWeatherElement } from "./components/types";
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
        <div className="row justify-content-center align-items-center">
          <div className="col-12 col-sm-11 d-flex flex-column justify-content-center align-items-center mt-5">
            <h1 className="text-secondary">Прогноз погоды</h1>
          </div>
          <div className="col-12 col-sm-11 d-flex flex-column justify-content-center align-items-center mt-2">
            <h4 className="text-secondary">Анапа</h4>
          </div>
          <div className="col-12 col-sm-11 d-flex flex-column justify-content-center align-items-center mt-5 mb-5">
            <table className="table">
              <thead>
                <tr>
                  {getSlicedFiveDayMeteo.map((weatherElement: IWeatherElement, index: number) => {
                    const { dt_txt } = weatherElement;

                    const time = dt_txt.split(" ")[1].slice(0, -3);
                    const date = dt_txt
                      .split(" ")[0]
                      .split("-")
                      .reverse()
                      .join("/");

                    return (
                      <th scope="col" key={`${time}_${date}_${index}`} style={{ minWidth: "150px" }}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <h5>{date}</h5>
                          <h6>{time}</h6>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {getSlicedFiveDayMeteo.map((weatherElement: IWeatherElement, index: number) => {
                    const { weather } = weatherElement;
                    const { icon } = weather[0];

                    return (
                      <th scope="row" key={`${icon}_${index}`}>
                        <div className="d-flex flex-column justify-content-center align-items-center">
                          <img src={"http://openweathermap.org/img/wn/" + icon + "@2x.png"} alt="icon" />
                        </div>
                      </th>
                    );
                  })}
                </tr>

                <tr>
                  {getSlicedFiveDayMeteo.map((weatherElement: IWeatherElement, index: number) => {
                    const { weather } = weatherElement;
                    const { description } = weather[0];

                    return (
                      <th scope="row" key={`${description}_${index}`}>
                        <div className="text-center">
                          <h6>{description}</h6>
                        </div>
                      </th>
                    );
                  })}
                </tr>

                <tr>
                  {getSlicedFiveDayMeteo.map((weatherElement: IWeatherElement, index: number) => {
                    const {
                      main: { temp }
                    } = weatherElement;

                    const temperature = "" + Math.round(temp);

                    return (
                      <th scope="row" key={`${temp}_${index}`}>
                        <div className="text-center">
                          <h6>{temperature}&#186;</h6>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </React.Fragment>
  );
});

export default MeteoPage;
