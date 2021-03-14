import { createContext, useContext } from "react";
import JsonPlaceHolderStore from "./JsonPlaceHolderStore";

const context = createContext(new JsonPlaceHolderStore());

export const useContextJsonPlaceHolderStore = () => useContext(context);
