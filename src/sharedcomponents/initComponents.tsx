import AboutPage from "../components/Pages/AboutPage";
import MainPage from "../components/Pages/MainPage";
import YandexMapsPage from "../components/Pages/YandexMapsPage";
import { IPages } from "./types";

export const pages: IPages = {
  Главная: {
    path: "/",
    component: MainPage,
    isExact: true,
    isActive: true
  },
  "Yandex Maps": {
    path: "/ymaps",
    component: YandexMapsPage,
    isExact: false,
    isActive: false
  },
  Описание: {
    path: "/about",
    component: AboutPage,
    isExact: false,
    isActive: false
  }
};
