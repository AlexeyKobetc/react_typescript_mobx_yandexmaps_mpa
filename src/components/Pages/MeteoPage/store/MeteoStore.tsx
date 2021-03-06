import { action, computed, makeObservable, observable } from "mobx";
import { currentMeteoUrl, fiveDayMeteoUrl, getData } from "../components/functions";
import { ICurrentMeteoData, ICurrentWeather, IFiveDayMeteoData, IWeatherElement } from "../components/types";

class MeteoStore {
  fiveDayMeteo: IWeatherElement[] = [];
  currentMeteo: ICurrentWeather = { cod: "", temp: 0, deg: 0, speed: 0, description: "", icon: "" };

  meteoLoadStatus: {
    isFiveDayMeteoLoad: boolean;
    isCurrentMeteoLoad: boolean;
  } = {
    isFiveDayMeteoLoad: false,
    isCurrentMeteoLoad: false
  };

  countMeteoCellsOnScreen: number = 3;

  get getIsCurrentMeteoLoad() {
    return this.meteoLoadStatus.isCurrentMeteoLoad;
  }

  get getIsFiveDayMeteoLoad() {
    return this.meteoLoadStatus.isFiveDayMeteoLoad;
  }

  get getCurrentMeteo() {
    return this.currentMeteo;
  }

  get getFiveDayMeteo() {
    return this.fiveDayMeteo;
  }

  get getCountMeteoCellsOnScreen() {
    return this.countMeteoCellsOnScreen;
  }

  get getSlicedFiveDayMeteo() {
    return this.fiveDayMeteo.slice(0, this.countMeteoCellsOnScreen);
  }

  setCountMeteoCellsOnScreen = (count: number): void => {
    this.countMeteoCellsOnScreen = count;
  };

  constructor() {
    makeObservable(this, {
      fiveDayMeteo: observable,
      currentMeteo: observable,
      meteoLoadStatus: observable,
      countMeteoCellsOnScreen: observable,

      setCurrentMeteo: action,
      setFiveDayMeteo: action,

      setCountMeteoCellsOnScreen: action,

      getCurrentMeteo: computed,
      getFiveDayMeteo: computed,
      getSlicedFiveDayMeteo: computed,
      getIsCurrentMeteoLoad: computed,
      getIsFiveDayMeteoLoad: computed,
      getCountMeteoCellsOnScreen: computed
    });

    this.setCurrentMeteo();
    this.setFiveDayMeteo();
  }

  setCurrentMeteo = () => {
    getData(currentMeteoUrl)
      .then((currentMeteoData: ICurrentMeteoData) => {
        const {
          cod,
          main: { temp },
          wind: { deg, speed },
          weather
        } = currentMeteoData;

        const { description, icon } = weather[0];

        if (cod && temp && deg && speed && description && icon) {
          this.currentMeteo = {
            cod,
            temp,
            deg,
            speed,
            description,
            icon: "http://openweathermap.org/img/wn/" + icon + "@2x.png"
          };
          this.meteoLoadStatus.isCurrentMeteoLoad = true;
        } else {
          this.meteoLoadStatus.isCurrentMeteoLoad = false;
        }
      })
      .catch((error: Error) => console.log(error.message));
  };

  setFiveDayMeteo = () => {
    getData(fiveDayMeteoUrl)
      .then((fiveDayMeteoData: IFiveDayMeteoData) => {
        const { cod, list } = fiveDayMeteoData;

        if (cod === "200" && list.length) {
          this.fiveDayMeteo = list.filter(
            (weather: IWeatherElement) =>
              weather.dt_txt.indexOf("00:00:00") !== -1 ||
              weather.dt_txt.indexOf("06:00:00") !== -1 ||
              weather.dt_txt.indexOf("12:00:00") !== -1 ||
              weather.dt_txt.indexOf("18:00:00") !== -1
          );
          this.meteoLoadStatus.isFiveDayMeteoLoad = true;
        } else {
          this.meteoLoadStatus.isFiveDayMeteoLoad = false;
        }
      })
      .catch((error: Error) => console.log(error.message));
  };
}

export default MeteoStore;
