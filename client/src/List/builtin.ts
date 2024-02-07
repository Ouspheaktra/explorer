import { toDateString } from "../utils";
import { Sort } from "./types";
import { createSort } from "./utils";

export const builtinSorts: Sort[] = [
  {
    name: "Name",
    sort: createSort(
      (file) => file.name[0].toUpperCase(),
      (a, b) => a.name.localeCompare(b.name)
    )
  },
  {
    name: "Date",
    sort: createSort(
      (file) => file.stat.mtime ? toDateString(file.stat.mtime) : false,
      (a, b) => a.stat.mtime!.getTime() - b.stat.mtime!.getTime()
    )
  },
];