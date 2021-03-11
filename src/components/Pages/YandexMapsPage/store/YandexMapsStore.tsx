import { action, computed, makeObservable, observable, reaction } from "mobx";
import {
  ymScriptUrl,
  setUserPositionFromGeolocation,
  setUserPositionFromYandex,
  createMapMarker,
  coordsToAddressCodding,
  adressToCoordsCodding,
  clearInitTimer
} from "../components/functions";
import { ICars, IGeoMarker, IYMData, EYmData, ICoordinates, IAddress, IPosition } from "../components/types";

declare var ymaps: any;

export class YandexMapsStore {
  ym: any = null;
  ymDiv: HTMLDivElement | null = null;
  ymCurrentMapZoom: number = 15;

  ymData: IYMData = {
    defaultPosition: {
      coordinates: { latitude: 56.85, longitude: 60.65 },
      address: {
        region: "Россия, Свердловская область, Екатеринбург",
        fullAddress:
          "Россия, Свердловская область, Екатеринбург, Кировский район, микрорайон Втузгородок, Академическая улица, 16",
        shortAddress: "Академическая улица, 16"
      }
    },
    userPosition: {
      coordinates: { longitude: 0, latitude: 0 },
      address: {
        region: "",
        fullAddress: "",
        shortAddress: ""
      }
    },
    destinationPosition: {
      coordinates: { longitude: 0, latitude: 0 },
      address: {
        region: "",
        fullAddress: "",
        shortAddress: ""
      }
    }
  };

  ymCars: ICars = {};
  ymCarsGeoCollection: any = null;

  ymUserGeoMarker: IGeoMarker = {
    ymGeoMarker: null,
    icon: "islands#darkGreenStretchyIcon",
    id: "userGeoMarker",
    labelTextHeader: "Вы здесь: "
  };
  ymDestinationGeoMarker: IGeoMarker = {
    ymGeoMarker: null,
    icon: "islands#yellowStretchyIcon",
    id: "destinationGeoMarker",
    labelTextHeader: "Вам нужно сюда: "
  };

  isYmScriptLoad: boolean | null = null;
  isYmReady: boolean | null = null;
  isGeolocationTrySetCurrentPosition: boolean | null = null;

  initTimer: NodeJS.Timeout | null = null;

  get getymData() {
    return this.ymData;
  }

  get isUserCoordinatesExist() {
    return (
      this.getymData.userPosition.coordinates.latitude && this.getymData.userPosition.coordinates.longitude
    );
  }

  get isDestinationCoordinatesExist() {
    return (
      this.getymData.destinationPosition.coordinates.latitude &&
      this.getymData.destinationPosition.coordinates.longitude
    );
  }

  get getCurrentCoordinates() {
    return this.getymData.userPosition.coordinates.latitude &&
      this.getymData.userPosition.coordinates.longitude
      ? this.getymData.userPosition.coordinates
      : this.getymData.defaultPosition.coordinates;
  }

  get getCurrentAddress() {
    return this.getymData.userPosition.address.fullAddress &&
      this.getymData.userPosition.address.shortAddress &&
      this.getymData.userPosition.address.region
      ? this.getymData.userPosition.address
      : this.getymData.defaultPosition.address;
  }

  get getDestinationCoordinates() {
    return this.getymData.destinationPosition.coordinates.latitude &&
      this.getymData.destinationPosition.coordinates.longitude
      ? this.getymData.destinationPosition.coordinates
      : this.getymData.defaultPosition.coordinates;
  }

  get getDestinationAddress() {
    return this.getymData.destinationPosition.address.fullAddress &&
      this.getymData.destinationPosition.address.shortAddress &&
      this.getymData.destinationPosition.address.region
      ? this.getymData.destinationPosition.address
      : this.getymData.defaultPosition.address;
  }

  get getIsYmReady() {
    return this.isYmReady;
  }

  setYmDiv = (ymContainer: HTMLDivElement) => {
    if (ymContainer) this.ymDiv = ymContainer;
  };

  setYmReady = (isReady: boolean) => {
    this.isYmReady = isReady;
  };

  setYmCurrentZoom = (newZoom: number) => {
    this.ymCurrentMapZoom = newZoom;
  };

  constructor() {
    makeObservable(this, {
      ym: observable,
      ymDiv: observable,
      ymData: observable,
      isYmScriptLoad: observable,
      isYmReady: observable,
      isGeolocationTrySetCurrentPosition: observable,

      getymData: computed,
      getIsYmReady: computed,
      getCurrentAddress: computed,
      getCurrentCoordinates: computed,
      getDestinationAddress: computed,
      getDestinationCoordinates: computed,

      isUserCoordinatesExist: computed,
      isDestinationCoordinatesExist: computed,

      setYmDiv: action,
      setYmData: action,
      setYmReady: action,
      setYmCurrentZoom: action,
      loadYmScript: action
    });

    reaction(
      () => this.ymDiv,
      () => {
        //console.log("this.ymDiv: ", this.ymDiv);
        this.isYmReady &&
          this.ymDiv &&
          this.initYm(this.getCurrentCoordinates, this.ymCurrentMapZoom, this.ymDiv);
      }
    );

    reaction(
      () => this.ymData,
      () => {
        //console.log(JSON.stringify(this.getymData));
      }
    );

    reaction(
      () => this.isGeolocationTrySetCurrentPosition,
      () => {
        //console.log("this.isGeolocationTrySetCurrentPosition: ", this.isGeolocationTrySetCurrentPosition);
      }
    );

    reaction(
      () => this.isYmScriptLoad,
      () => {
        //console.log("this.isYmScriptLoad: ", this.isYmScriptLoad);
      }
    );

    this.initGeo();
  }

  initGeo = () => {
    this.loadYmScript(ymScriptUrl);

    setUserPositionFromGeolocation(
      coordinates => {
        const { latitude, longitude } = coordinates;
        this.setYmData({ latitude, longitude }, EYmData.USER_POSITION);
      },
      () => {
        this.isGeolocationTrySetCurrentPosition = true;
      }
    );

    this.initTimer = setInterval(() => {
      //console.log("INITING ....");
      if (this.isYmScriptLoad && this.ymDiv && this.isGeolocationTrySetCurrentPosition) {
        this.initYm(this.getCurrentCoordinates, this.ymCurrentMapZoom, this.ymDiv);

        clearInitTimer(this.initTimer as NodeJS.Timeout);
      }
    }, 500);
  };

  loadYmScript(scriptUrl: string) {
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

  initYm = (mapCenterCoordinates: ICoordinates, mapZoom: number, mapDIVContainer: HTMLDivElement) => {
    const { latitude, longitude } = mapCenterCoordinates;
    const isReinit = this.ym !== null;

    if (isReinit) {
      this.ym.destroy();
      this.ym = null;
      this.ymUserGeoMarker.ymGeoMarker = null;
      this.ymDestinationGeoMarker.ymGeoMarker = null;
    }

    ymaps
      .ready()
      .then(() => {
        this.ym = new ymaps.Map(mapDIVContainer, {
          center: [latitude, longitude],
          zoom: mapZoom,
          controls: ["smallMapDefaultSet"]
        });
      })
      .then(() => {
        this.setYmReady(true);
        !isReinit &&
          setUserPositionFromYandex((coordinates: ICoordinates, address: IAddress) => {
            this.setYmData(coordinates, EYmData.USER_POSITION);
            this.setYmData(address, EYmData.USER_POSITION);

            this.setPosition(EYmData.USER_POSITION);

            const { latitude, longitude } = this.getCurrentCoordinates;
            this.ym.setCenter([latitude, longitude]);
          });

        this.isUserCoordinatesExist && this.setPosition(EYmData.USER_POSITION);
        this.isDestinationCoordinatesExist && this.setPosition(EYmData.DESTINATION_POSITION);

        this.ym.events.add("contextmenu", (ymEvent: any) => {
          const mapClickCoordinates: number[] = ymEvent.get("coords");

          this.setPosition(EYmData.DESTINATION_POSITION, {
            latitude: mapClickCoordinates[0],
            longitude: mapClickCoordinates[1]
          });
        });

        this.ym.events.add("click", (ymEvent: any) => {
          const mapClickCoordinates: number[] = ymEvent.get("coords");

          this.setPosition(EYmData.USER_POSITION, {
            latitude: mapClickCoordinates[0],
            longitude: mapClickCoordinates[1]
          });
        });

        this.ym.events.add("boundschange", (ymEvent: any) => {
          this.setYmCurrentZoom(ymEvent.get("newZoom"));
        });
      })
      .catch((error: Error) => {
        this.setYmReady(false);
        console.log(error.message);
      });
  };

  setPosition = (namePosition: EYmData, coordinates?: ICoordinates, address?: IAddress) => {
    if (!coordinates && !address) {
      this.drawMarker(namePosition);
    } else if (coordinates && !address) {
      coordsToAddressCodding(coordinates)
        .then((address: any) => {
          const { description, name, text } = address;
          this.setYmData(coordinates, namePosition);
          this.setYmData({ region: description, fullAddress: text, shortAddress: name }, namePosition);
          this.drawMarker(namePosition);
        })
        .catch((error: Error) => console.log(error.message));
    } else if (!coordinates && address) {
      adressToCoordsCodding(address.fullAddress)
        .then((coordinates: any) => {
          this.setYmData(
            {
              latitude: coordinates[0],
              longitude: coordinates[1]
            },
            namePosition
          );
          this.setYmData(address, namePosition);
          this.drawMarker(namePosition);
        })
        .catch((error: Error) => console.log(error.message));
    }
  };

  drawMarker = (namePosition: EYmData) => {
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

  setYmData = (data: ICoordinates | IAddress, namePosition: EYmData) => {
    if ("latitude" in data && "longitude" in data) {
      const { longitude, latitude } = data;
      this.ymData = {
        ...this.ymData,
        [namePosition]: { ...this.ymData[namePosition], coordinates: { longitude, latitude } }
      };
    } else if ("region" in data && "fullAddress" in data && "shortAddress" in data) {
      const { region, fullAddress, shortAddress } = data;

      this.ymData = {
        ...this.ymData,
        [namePosition]: { ...this.ymData[namePosition], address: { region, fullAddress, shortAddress } }
      };
    }
  };
}
