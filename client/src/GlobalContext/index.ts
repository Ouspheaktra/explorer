import { createContext, useContext } from "react";
import { iData, iDir, iFile } from "../types";
import type { postFile } from "../utils/api";

export type SetFile = (file: iFile | null) => any;
export type SetDir = (dir: string, pushHistory?: boolean) => Promise<iDir>;
export type UpdateFiles = (
  postFiles: Parameters<typeof postFile>[]
) => Promise<iFile[]>;
export type DeleteFiles = (files: iFile[]) => Promise<any>;
export type Next = (plus: number) => void;
export type SetNext = (next: Next) => void;

export type iGlobalContext = iData & {
  viewerMode: boolean;
  setViewerMode: (viewerMode: boolean) => void;
  setDir: SetDir;
  setFile: SetFile;
  updateFiles: UpdateFiles;
  deleteFiles: DeleteFiles;
  next: Next;
  setNext: SetNext;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
