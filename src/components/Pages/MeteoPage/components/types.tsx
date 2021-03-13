export interface IWind {
  deg: number;
  speed: number;
}

export interface IWeather {
  description: string;
  icon: string;
}

export interface IWeatherElement {
  dt_txt: string;
  main: { temp: number };
  weather: IWeather[];
  wind: IWind;
}

export interface ICurrentWeather {
  cod: string;
  temp: number;
  deg: number;
  speed: number;
  description: string;
  icon: string;
}

export interface ICurrentMeteoData {
  cod: string;
  main: { temp: number };
  wind: IWind;
  weather: IWeather[];
}

export interface IFiveDayMeteoData {
  cod: string;
  dt_txt: string;
  list: IWeatherElement[];
}
