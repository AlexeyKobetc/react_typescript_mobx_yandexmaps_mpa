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

export async function getUserPosition<T>(): Promise<T> {
  const location = ymaps.geolocation.get({ provider: "yandex", mapStateAutoApply: true });

  return await location;
}

export function setUserPositionFromGeolocation(
  successCallback: (coordinates: ICoordinates) => void,
  flagSetCallback: () => void
) {
  if (navigator.geolocation) {
    const options = {
      enableHighAccuracy: true
    };

    const error = (error: GeolocationPositionError) => {
      flagSetCallback();
    };

    const success = async (position: GeolocationPosition) => {
      const { coords } = position;
      const { latitude, longitude } = coords;
      successCallback({ latitude, longitude });
      flagSetCallback();
    };

    navigator.geolocation.getCurrentPosition(success, error, options);

    setTimeout(() => {
      flagSetCallback();
    }, 9000);
  } else {
    flagSetCallback();
  }
}

export function setUserPositionFromYandex(
  setPositionCallback: (coordinates: ICoordinates, address: IAddress) => void
) {
  getUserPosition()
    .then((position: any) => {
      const coordinates: number[] = position.geoObjects.get(0).geometry.getCoordinates();
      const { description, name, text } = position.geoObjects.get(0).properties.getAll();

      setPositionCallback(
        { latitude: coordinates[0], longitude: coordinates[1] },
        { region: description, fullAddress: text, shortAddress: name }
      );
    })
    .catch((error: Error) => console.log(error.message));
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
