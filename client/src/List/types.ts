import { iFile } from "../types";

export type Order = "asc" | "desc";
export type SortedGroup = {
  name: string;
  files: iFile[];
};
export type Sort = {
  name: string;
  sort: (files: iFile[]) => SortedGroup[];
};

export interface FileComponentProps {
  fullMode: boolean;
  file: iFile;
}