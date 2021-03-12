import { IAddress, ICoordinates } from "./types";

declare var ymaps: any;

export const ymScriptUrl =
  "https://api-maps.yandex.ru/2.1/?apikey=ba493d93-6641-43da-97fe-0d3f01ccf9b0&lang=ru_RU";

export async function adressToCoordsCodding<T>(address: string): Promise<T> {
  const responce = await ymaps.geocode(address);
  return await (responce.geoObjects.get(0).geometry.getCoordinates() as Promise<T>);
}

export async function coordsToAddressCodding<T>(coordinates: ICoordinates): Promise<T> {
  const { latitude, longitude } = coordinates;
  const responce = await ymaps.geocode([latitude, longitude]);
  return await (responce.geoObjects.get(0).properties.getAll() as Promise<T>);
}

export async function getUserPosition<T>(provider: string = "yandex"): Promise<T> {
  const location = ymaps.geolocation.get({ provider: provider, mapStateAutoApply: true });

  return await location;
}

export function createMapMarker(
  markerType: string,
  markerId: string,
  markerContent: string = "",
  markerHoverContent: string = "",
  draggAble: boolean = true,
  coordinates: ICoordinates
) {
  const { latitude, longitude } = coordinates;
  return new ymaps.GeoObject(
    {
      geometry: {
        type: "Point",
        coordinates: [latitude, longitude]
      },
      properties: {
        iconContent: markerContent,
        hintContent: markerHoverContent,
        id: markerId
      }
    },
    {
      preset: markerType,
      draggable: draggAble
    }
  );
}

export function clearInitTimer(timer: NodeJS.Timeout) {
  //console.log("STOP INIT.");
  clearInterval(timer);
}
