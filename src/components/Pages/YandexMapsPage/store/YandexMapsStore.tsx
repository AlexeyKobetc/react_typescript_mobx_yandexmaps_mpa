import { action, computed, makeObservable, observable, reaction } from "mobx";
import {
  ymScriptUrl,
  createMapMarker,
  coordsToAddressCodding,
  adressToCoordsCodding,
  clearInitTimer,
  getUserPosition
} from "../components/functions";
import { initYmData, initYmDestinationGeoMarker, initYmUserGeoMarker } from "../components/initComponent";
import { ICars, IGeoMarker, IYMData, EYmData, ICoordinates, IAddress } from "../components/types";

declare var ymaps: any;

export class YandexMapsStore {
  ym: any = null;
  ymDiv: HTMLDivElement | null = null;
  ymInputs: {
    [name: string]: { suggetView: any; ref: HTMLInputElement | null };
  } = {};
  ymCurrentMapZoom: number = 15;

  ymData: IYMData = initYmData;

  ymCars: ICars = {};
  ymCarsGeoCollection: any = null;

  ymUserGeoMarker: IGeoMarker = initYmUserGeoMarker;
  ymDestinationGeoMarker: IGeoMarker = initYmDestinationGeoMarker;
  isYmScriptLoad: boolean = false;
  isYmReady: boolean = false;

  initTimer: NodeJS.Timeout | null = null;

  get getymData(): IYMData {
    return this.ymData;
  }

  get getDefaultAddress(): IAddress {
    return this.getymData.defaultPosition.address;
  }

  get getCurrentCoordinates(): ICoordinates {
    return this.getymData.userPosition.coordinates.latitude &&
      this.getymData.userPosition.coordinates.longitude
      ? this.getymData.userPosition.coordinates
      : this.getymData.defaultPosition.coordinates;
  }

  get getCurrentAddress(): IAddress {
    return this.getymData.userPosition.address.fullAddress &&
      this.getymData.userPosition.address.shortAddress &&
      this.getymData.userPosition.address.region
      ? this.getymData.userPosition.address
      : this.getymData.defaultPosition.address;
  }

  get getDestinationCoordinates(): ICoordinates {
    return this.getymData.destinationPosition.coordinates.latitude &&
      this.getymData.destinationPosition.coordinates.longitude
      ? this.getymData.destinationPosition.coordinates
      : this.getymData.defaultPosition.coordinates;
  }

  get getDestinationAddress(): IAddress {
    return this.getymData.destinationPosition.address.fullAddress &&
      this.getymData.destinationPosition.address.shortAddress &&
      this.getymData.destinationPosition.address.region
      ? this.getymData.destinationPosition.address
      : this.getymData.defaultPosition.address;
  }

  get getIsYmReady(): boolean {
    return this.isYmReady;
  }

  get getYmInputs(): { [name: string]: { suggetView: any; ref: HTMLInputElement | null } } {
    return this.ymInputs;
  }

  setYmDiv = (ymContainer: HTMLDivElement): void => {
    if (ymContainer) this.ymDiv = ymContainer;
  };

  setYmInputs = (inputName: string, inputRef: HTMLInputElement): void => {
    this.ymInputs = {
      ...this.ymInputs,
      [inputName]: { ...this.ymInputs[inputName], ref: inputRef }
    };
  };

  set setYmReady(isReady: boolean) {
    this.isYmReady = isReady;
  }

  setYmCurrentZoom = (newZoom: number): void => {
    this.ymCurrentMapZoom = newZoom;
  };

  constructor() {
    makeObservable(this, {
      ym: observable,
      ymDiv: observable,
      ymInputs: observable,
      ymData: observable,
      isYmScriptLoad: observable,
      isYmReady: observable,

      getymData: computed,
      getYmInputs: computed,
      getIsYmReady: computed,
      getDefaultAddress: computed,
      getCurrentAddress: computed,
      getCurrentCoordinates: computed,
      getDestinationAddress: computed,
      getDestinationCoordinates: computed,

      setYmDiv: action,
      setYmInputs: action,
      setYmData: action,
      setYmCurrentZoom: action,
      loadYmScript: action,
      initAutoComplite: action
    });

    reaction(
      () => this.ymDiv,
      (): void => {
        this.isYmReady && this.ymDiv && this.initMap(this.ymCurrentMapZoom, this.ymDiv);
      }
    );

    this.initApi();
  }

  mapHandler = (mapEvent: any): void => {
    const type = mapEvent.get("type");

    if (type === "contextmenu") {
      const mapClickCoordinates: number[] = mapEvent.get("coords");
      this.setPosition(EYmData.DESTINATION_POSITION, {
        latitude: mapClickCoordinates[0],
        longitude: mapClickCoordinates[1]
      });
    }
    if (type === "click") {
      const mapClickCoordinates: number[] = mapEvent.get("coords");
      this.setPosition(EYmData.USER_POSITION, {
        latitude: mapClickCoordinates[0],
        longitude: mapClickCoordinates[1]
      });
    }
    if (type === "boundschange") {
      this.setYmCurrentZoom(mapEvent.get("newZoom"));
    }
  };

  initAutoComplite = (inputsRefs: {
    [name: string]: { suggetView: any; ref: HTMLInputElement | null };
  }): void => {
    Object.keys(inputsRefs).forEach((inputName: string) => {
      const inputRef = inputsRefs[inputName].ref;

      if (inputRef) {
        const suggetView = new ymaps.SuggestView(inputRef, {
          results: 20,
          offset: [0, 0],
          provider: {
            suggest: (request: string) => {
              return new ymaps.suggest(
                inputName === "inputSourceAddress"
                  ? this.getCurrentAddress.region
                  : this.getDestinationAddress.region + request
              );
            }
          }
        });
        inputsRefs = {
          ...inputsRefs,
          [inputName]: { ...inputsRefs[inputName], suggetView }
        };
      }
    });
  };

  initMap = (mapZoom: number, mapDIVContainer: HTMLDivElement): void => {
    const getYm = (mapZoom: number, mapDIVContainer: HTMLDivElement) => {
      return new ymaps.Map(mapDIVContainer, {
        center: [this.getCurrentCoordinates.latitude, this.getCurrentCoordinates.longitude],
        zoom: mapZoom,
        controls: ["smallMapDefaultSet"],
        autoFitToViewport: "always"
      });
    };
    if (!this.ym) {
      console.log("GETTING USER POSITION (COORDINATES/ADDRESS).");
      getUserPosition("yandex")
        .then((position: any) => {
          const coordinates: number[] = position.geoObjects.get(0).geometry.getCoordinates();
          const { description, name, text } = position.geoObjects.get(0).properties.getAll();
          console.log("GET USER POSITION (COORDINATES/ADDRESS).");

          this.setYmData(
            { latitude: coordinates[0], longitude: coordinates[1] },
            { region: description, fullAddress: text, shortAddress: name },
            EYmData.USER_POSITION
          );
        })
        .then(() => {
          this.ym = getYm(mapZoom, mapDIVContainer);
        })
        .then(() => {
          this.setPosition(EYmData.USER_POSITION);

          this.ym.events.add("contextmenu", this.mapHandler);
          this.ym.events.add("click", this.mapHandler);
          this.ym.events.add("boundschange", this.mapHandler);
          console.log("MAP READY.");
          this.setYmReady = true;
        })
        .catch((error: Error) => console.log(error.message));
    } else {
      this.ym.destroy();
      this.ym = null;
      this.setYmReady = false;

      this.ym = this.ym = getYm(mapZoom, mapDIVContainer);

      this.ymUserGeoMarker.ymGeoMarker && this.ym.geoObjects.add(this.ymUserGeoMarker.ymGeoMarker);
      this.ymDestinationGeoMarker.ymGeoMarker &&
        this.ym.geoObjects.add(this.ymDestinationGeoMarker.ymGeoMarker);

      this.ym.events.add("contextmenu", this.mapHandler);
      this.ym.events.add("click", this.mapHandler);
      this.ym.events.add("boundschange", this.mapHandler);
      console.log("MAP READY.");
      this.setYmReady = true;
    }
  };

  initApi = (): void => {
    this.loadYmScript(ymScriptUrl);
    this.initTimer = setInterval(() => {
      console.log("INITING ...");
      if (this.isYmScriptLoad && this.ymDiv && Object.keys(this.ymInputs).length >= 2) {
        ymaps.ready(() => {
          console.log("ymaps READY.");
          this.ymDiv && this.initMap(this.ymCurrentMapZoom, this.ymDiv);
          //this.initAutoComplite(this.ymInputs);
        });
        console.log("STOP INIT.");
        clearInitTimer(this.initTimer as NodeJS.Timeout);
      }
    }, 500);
  };

  loadYmScript(scriptUrl: string): void {
    const script = document.createElement("script");

    script.src = scriptUrl;
    script.async = true;

    document.body.appendChild(script);
    script.onload = () => {
      this.isYmScriptLoad = true;
    };
    script.onerror = () => {
      this.isYmScriptLoad = false;
    };
  }

  setPosition = (namePosition: EYmData, coordinates?: ICoordinates, address?: IAddress): void => {
    if (coordinates && address) {
      this.setYmData(coordinates, address, namePosition);
      this.drawMarker(namePosition);
    } else if (!coordinates && !address) {
      this.drawMarker(namePosition);
    } else if (coordinates && !address) {
      coordsToAddressCodding(coordinates)
        .then((address: { description: string; name: string; text: string }) => {
          const { description, name, text } = address;
          this.setYmData(
            coordinates,
            { region: description, fullAddress: text, shortAddress: name },
            namePosition
          );

          this.drawMarker(namePosition);
        })
        .catch((error: Error) => console.log(error.message));
    } else if (!coordinates && address) {
      adressToCoordsCodding(address.fullAddress)
        .then((coordinates: number[]) => {
          this.setYmData(
            {
              latitude: coordinates[0],
              longitude: coordinates[1]
            },
            address,
            namePosition
          );

          this.drawMarker(namePosition);
        })
        .catch((error: Error) => console.log(error.message));
    }
  };

  drawMarker = (namePosition: EYmData): void => {
    let mapMarker: IGeoMarker =
      namePosition === EYmData.USER_POSITION ? this.ymUserGeoMarker : this.ymDestinationGeoMarker;
    let markerAddress: IAddress =
      namePosition === EYmData.USER_POSITION ? this.getCurrentAddress : this.getDestinationAddress;
    let markerCoordinates: ICoordinates =
      namePosition === EYmData.USER_POSITION ? this.getCurrentCoordinates : this.getDestinationCoordinates;
    const { latitude, longitude } = markerCoordinates;

    if (!mapMarker.ymGeoMarker) {
      mapMarker.ymGeoMarker = createMapMarker(
        mapMarker.icon,
        mapMarker.id,
        mapMarker.labelTextHeader + markerAddress.shortAddress,
        markerAddress.fullAddress,
        true,
        markerCoordinates
      );

      this.ym.geoObjects.add(mapMarker.ymGeoMarker);
      //this.ym.setCenter([latitude, longitude]);

      mapMarker.ymGeoMarker.events.add("dragend", (ymEvent: any) => {
        const target: any = ymEvent.get("target");
        const coordinates: number[] = target.geometry.getCoordinates();

        this.setPosition(namePosition, {
          latitude: coordinates[0],
          longitude: coordinates[1]
        });
      });
      mapMarker.ymGeoMarker.events.add("click", () => {});
    } else {
      this.ym.geoObjects.each((placeMark: any) => {
        if (placeMark.properties.get("id") === mapMarker.id) {
          placeMark.geometry.setCoordinates([latitude, longitude]);
        }
      });
      mapMarker.ymGeoMarker.properties.set(
        "iconContent",
        mapMarker.labelTextHeader + markerAddress.shortAddress
      );
      mapMarker.ymGeoMarker.properties.set("hintContent", markerAddress.fullAddress);
      //this.ym.setCenter([latitude, longitude]);
    }
  };

  setYmData = (coordinates: ICoordinates, address: IAddress, namePosition: EYmData): void => {
    this.ymData = {
      ...this.ymData,
      [namePosition]: { ...this.ymData[namePosition], coordinates, address }
    };
  };
}
