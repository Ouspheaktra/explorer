import { createContext, useContext } from "react";
import { iData, iDir, iFile } from "../types";
import type { postFile } from "../utils/api";
export type SetFile = (file: iFile | null) => any;
export type SetDir = (dir: string, pushHistory?: boolean) => Promise<iDir>;
export type UpdateFiles = (
  postFiles: Parameters<typeof postFile>[]
) => Promise<iFile[]>;
export type DeleteFiles = (files: iFile[]) => Promise<any>;
export type CommandFiles = (
  files: iFile[],
  command: string,
  newExt?: string
) => Promise<any>;
export type GetNext = (plus: number) => iFile | undefined;
export type Next = (plus: number) => void;
export type SetGetNext = (next: GetNext) => void;

export type iGlobalContext = iData & {
  setDir: SetDir;
  setFile: SetFile;
  updateFiles: UpdateFiles;
  deleteFiles: DeleteFiles;
  commandFiles: CommandFiles;
  next: Next;
  getNext: GetNext;
  setGetNext: SetGetNext;
};

// @ts-ignore
export const GlobalContext = createContext<iGlobalContext>({});
export const useGlobal = () => useContext(GlobalContext);
