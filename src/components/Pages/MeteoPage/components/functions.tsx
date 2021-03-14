import { ICurrentMeteoData, IFiveDayMeteoData } from "./types";

export const fiveDayMeteoUrl =
  "http://api.openweathermap.org/data/2.5/forecast?lat=44.89&lon=37.32&units=metric&lang=ru&appid=99f8ef29cc8ec4480788db0433e36c0c";
export const currentMeteoUrl =
  "http://api.openweathermap.org/data/2.5/weather?lat=44.89&lon=37.32&units=metric&lang=ru&appid=99f8ef29cc8ec4480788db0433e36c0c";

export async function getMeteo(url: string): Promise<ICurrentMeteoData | IFiveDayMeteoData> {
  const response = await fetch(url);
  return await response.json();
}
