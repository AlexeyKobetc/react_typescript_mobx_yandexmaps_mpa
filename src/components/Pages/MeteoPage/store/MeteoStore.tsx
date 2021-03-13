import { action, computed, makeObservable, observable, reaction } from "mobx";
import { currentMeteoUrl, fiveDayMeteoUrl, getMeteo } from "../components/functions";
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
    getMeteo(currentMeteoUrl)
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
      .catch((error: Error) => {
        this.meteoLoadStatus.isCurrentMeteoLoad = false;
      });
  };

  setFiveDayMeteo = () => {
    getMeteo(fiveDayMeteoUrl)
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
      .catch((error: Error) => {
        this.meteoLoadStatus.isFiveDayMeteoLoad = false;
      });
  };

  // fetchData = async (url: string) => {
  //   let response = await fetch(url);

  //   if (!response.ok) {
  //     throw new Error(`Error response status: ${response.status}, URL: ${url}`);
  //   }

  //   let data = await response.json();
  //   return data;
  // };

  // getCurrentMeteoData = async () => {
  //   await this.fetchData(currentMeteoUrl)
  //     .then((json: any) => {
  //       runInAction(() => {
  //         this.currentMeteoStore = json;
  //         this.meteoLoadStatus = { ...this.meteoLoadStatus, isCurrentMeteoLoad: true };
  //       });
  //     })
  //     .catch(error => {
  //       runInAction(() => {
  //         console.log(`Current Day Meteo Data Load Error: ${error.message}`);
  //         this.meteoLoadStatus = {
  //           ...this.meteoLoadStatus,
  //           error: {
  //             ...this.meteoLoadStatus.error,
  //             currentDayMeteo: `Current Day Meteo Data Load Error: ${error.message}`
  //           }
  //         };
  //       });
  //     });
  // };

  // getFiveDayMeteoData = async () => {
  //   await this.fetchData(fiveDayMeteoUrl)
  //     .then((json: any) => {
  //       runInAction(() => {
  //         this.fiveDayMeteoStore = json;
  //         this.meteoLoadStatus = { ...this.meteoLoadStatus, isFiveDayMeteoLoad: true };
  //       });
  //     })
  //     .catch(error => {
  //       runInAction(() => {
  //         console.log(`Five Day Meteo Data Load Error: ${error.message}`);
  //         this.meteoLoadStatus = {
  //           ...this.meteoLoadStatus,
  //           error: {
  //             ...this.meteoLoadStatus.error,
  //             fiveDayMeteo: `Five Day Meteo Data Load Error: ${error.message}`
  //           }
  //         };
  //       });
  //     });
  // };
}

export default MeteoStore;
