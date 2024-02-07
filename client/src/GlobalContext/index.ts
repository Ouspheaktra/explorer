import { createContext, useContext } from "react";
import { iData, iDir, iFile } from "../types";

export type SetFile = (file: iFile | null) => any;
export type setDir = (dir: string, pushHistory?: boolean) => Promise<iDir>;
export type UpdateFile = (
  file: iFile,
  details: iFile["details"],
  newName: string | null
) => Promise<void>;

export type iGlobalContext = iData & {
  viewerMode: boolean;
  setViewerMode: (viewerMode: boolean) => void;
  setDir: setDir;
  setFile: SetFile;
  updateFile: UpdateFile;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
