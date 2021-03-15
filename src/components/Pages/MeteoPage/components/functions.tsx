import { IWeatherElement } from "./types";

export const fiveDayMeteoUrl =
  "http://api.openweathermap.org/data/2.5/forecast?lat=44.89&lon=37.32&units=metric&lang=ru&appid=99f8ef29cc8ec4480788db0433e36c0c";
export const currentMeteoUrl =
  "http://api.openweathermap.org/data/2.5/weather?lat=44.89&lon=37.32&units=metric&lang=ru&appid=99f8ef29cc8ec4480788db0433e36c0c";

export async function getData(url: string): Promise<any> {
  const response = await fetch(url);
  return await response.json();
}

export const renderHeadRow = (array: IWeatherElement[]) =>
  array.map((weatherElement: IWeatherElement, index: number) => {
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
  });

export const renderIconsRow = (array: IWeatherElement[]) =>
  array.map((weatherElement: IWeatherElement, index: number) => {
    const { weather } = weatherElement;
    const { icon } = weather[0];
    const iconSrc = "http://openweathermap.org/img/wn/" + icon + "@2x.png";

    return (
      <th scope="row" key={`${icon}_${index}`}>
        <div className="d-flex flex-column justify-content-center align-items-center">
          <img src={iconSrc} alt="icon" />
        </div>
      </th>
    );
  });

export const renderDescriptionRow = (array: IWeatherElement[]) =>
  array.map((weatherElement: IWeatherElement, index: number) => {
    const { weather } = weatherElement;
    const { description } = weather[0];

    return (
      <th scope="row" key={`${description}_${index}`}>
        <div className="text-center">
          <h6>{description}</h6>
        </div>
      </th>
    );
  });

export const renderTemperatureRow = (array: IWeatherElement[]) =>
  array.map((weatherElement: IWeatherElement, index: number) => {
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
  });
