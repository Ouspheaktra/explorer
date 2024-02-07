import { iFile } from "../types";

export type Order = "asc" | "desc";
export type SortedGroup = {
  name: string;
  files: iFile[];
};
export type Sort = {
  name: string;
  showLabel: boolean;
  sort: (files: iFile[], order: Order) => SortedGroup[];
};