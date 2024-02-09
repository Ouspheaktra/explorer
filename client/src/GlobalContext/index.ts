import { createContext, useContext } from "react";
import { iData, iDir, iFile } from "../types";

export type SetFile = (file: iFile | null) => any;
export type SetDir = (dir: string, pushHistory?: boolean) => Promise<iDir>;
export type UpdateFile = (
  file: iFile,
  details: iFile["details"],
  newName: string | null
) => Promise<void>;
export type Next = (plus: number) => void;
export type SetNext = (next: Next) => void;

export type iGlobalContext = iData & {
  viewerMode: boolean;
  setViewerMode: (viewerMode: boolean) => void;
  setDir: SetDir;
  setFile: SetFile;
  updateFile: UpdateFile;
  next: Next;
  setNext: SetNext;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
