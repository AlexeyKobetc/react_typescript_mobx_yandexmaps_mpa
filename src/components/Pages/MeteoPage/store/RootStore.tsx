import { createContext, useContext } from "react";
import MeteoStore from "./MeteoStore";

const context = createContext(new MeteoStore());

export const useContextMeteoStore = () => useContext(context);
