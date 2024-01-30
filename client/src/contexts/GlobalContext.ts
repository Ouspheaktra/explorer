import { createContext, useContext } from "react";
import { iDir, iFile } from "../types";

export type SetFile = (file: iFile | null) => any;
export type Goto = (rawPath: string) => Promise<void>;
export type UpdateFile = (file: iFile, details: iFile["details"], newName: string | null) => Promise<void>;

export type iGlobalContext = {
  dir: iDir,
  goto: Goto,
  file: iFile,
  setFile: SetFile,
  updateFile: UpdateFile;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
