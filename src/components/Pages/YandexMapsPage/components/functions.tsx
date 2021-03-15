import { ICoordinates } from "./types";

declare var ymaps: any;

export const ymScriptUrl =
  "https://api-maps.yandex.ru/2.1/?apikey=ba493d93-6641-43da-97fe-0d3f01ccf9b0&lang=ru_RU";

export async function adressToCoordsCodding(address: string): Promise<number[]> {
  const responce = await ymaps.geocode(address);
  return await responce.geoObjects.get(0).geometry.getCoordinates();
}

export async function coordsToAddressCodding(
  coordinates: ICoordinates
): Promise<{ description: string; name: string; text: string }> {
  const { latitude, longitude } = coordinates;
  const responce = await ymaps.geocode([latitude, longitude]);
  return await responce.geoObjects.get(0).properties.getAll();
}

export async function getUserPosition<T>(provider: string = "yandex"): Promise<T> {
  const location = ymaps.geolocation.get({ provider: provider, mapStateAutoApply: true });

  return await location;
}

export async function checkAddress<T>(address: string, region: string): Promise<T> {
  return (await ymaps.geocode(region + " " + address)) as Promise<T>;
}

export function createMapMarker(
  markerType: string,
  markerId: string,
  markerContent: string = "",
  markerHoverContent: string = "",
  draggAble: boolean = true,
  coordinates: ICoordinates
): void {
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

export function clearInitTimer(timer: NodeJS.Timeout): void {
  clearInterval(timer);
}

export const fadeOut = (root: HTMLDivElement) => {
  let loadingDiv = root.querySelector("div");
  if (loadingDiv !== null) {
    loadingDiv.style.opacity = "0";
    setTimeout(() => {
      if (loadingDiv) {
        loadingDiv.style.display = "none";
      }
    }, 2000);
  }
};

export const changeButtonLabel = (event: any) => {
  const { target, type } = event;

  const { id } = target;

  if (type === "shown.bs.collapse") {
    if (id === "orderDiv") {
      const orderButton = document.querySelector("#orderButton");

      if (orderButton) orderButton.textContent = `unfold_less`;
    }
    if (id === "mapDiv") {
      const mapButton = document.querySelector("#mapButton");
      if (mapButton) mapButton.textContent = `unfold_less`;
    }
  }
  if (type === "hidden.bs.collapse") {
    if (id === "orderDiv") {
      const orderButton = document.querySelector("#orderButton");

      if (orderButton) orderButton.textContent = `unfold_more`;
    }
    if (id === "mapDiv") {
      const mapButton = document.querySelector("#mapButton");
      if (mapButton) mapButton.textContent = `unfold_more`;
    }
  }
};

export const collapseButton = (idButton: string, idCollapseChild: string) => (
  <span
    className="btn btn-outline-secondary btn-sm material-icons"
    style={{ width: "2rem" }}
    id={idButton}
    data-bs-toggle="collapse"
    data-bs-target={`#${idCollapseChild}`}
    aria-expanded="false"
    aria-controls="collapseExample"
  >
    unfold_less
  </span>
);

export const helpRow = () => (
  <div className="row d-flex justify-content-center align-items-center">
    <div className="col-12 d-flex flex-row flex-wrap justify-content-around align-items-center bg-dark text-light pt-1">
      <h6>
        <strong>Левая клавиша мыши</strong> - установить маркер отправления
      </h6>
      <h6>
        <strong>Правая клавиша мыши</strong> - установить маркер назначения
      </h6>
    </div>
  </div>
);
