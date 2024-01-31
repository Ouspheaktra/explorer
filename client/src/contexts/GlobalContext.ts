import { createContext, useContext } from "react";
import { iData, iFile } from "../types";

export type SetFile = (file: iFile | null) => any;
export type Goto = (rawPath: string, pushHistory?: boolean) => Promise<iData>;
export type UpdateFile = (
  file: iFile,
  details: iFile["details"],
  newName: string | null
) => Promise<void>;

export type iGlobalContext = iData & {
  goto: Goto;
  setFile: SetFile;
  updateFile: UpdateFile;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
