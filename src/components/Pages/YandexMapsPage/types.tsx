export interface ICoordinates {
  latitude: number;
  longitude: number;
}

export interface IAddress {
  region: string;
  fullAddress: string;
  shortAddress: string;
}

export interface IPosition {
  coordinates: ICoordinates;
  address: IAddress;
}

export interface IYMData {
  [name: string]: IPosition;
}

export interface ICars {
  [carId: string]: ICar;
}
export interface ICar {
  latitude: number;
  longitude: number;
  address: string;
  distance: number;
}

export interface IGeoMarker {
  ymGeoMarker: any;
  icon: string;
  id: string;
  labelTextHeader: string;
}

export enum EYmData {
  DEFAULT_POSITION = "defaultPosition",
  USER_POSITION = "userPosition",
  DESTINATION_POSITION = "destinationPosition"
}
