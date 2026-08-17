import { createContext, useContext } from "solid-js";

export const ColorModeContext = createContext();

export const useColorMode = () => useContext(ColorModeContext);
