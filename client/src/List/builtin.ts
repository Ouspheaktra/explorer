import { iFile } from "../types";
import { toDateString } from "../utils";
import { Sort } from "./types";
import { createSortedGroup } from "./utils";

export const builtinSorts: Sort[] = [
  {
    name: "Name",
    sort: (files, order) => {
      // sort
      if (order === "asc") files.sort((a, b) => a.name.localeCompare(b.name));
      else files.sort((a, b) => b.name.localeCompare(a.name));
      //
      return createSortedGroup(files, (file) => file.name[0].toUpperCase());
    },
  },
  {
    name: "Date",
    sort: (files, order) => {
      //
      const knowns: iFile[] = [],
        unknowns: iFile[] = [];
      for (let file of files)
        if (file.stat.mtime) knowns.push(file);
        else unknowns.push(file);
      // sort
      if (order === "asc")
        knowns.sort(
          (a, b) => a.stat.mtime!.getTime() - b.stat.mtime!.getTime()
        );
      else
        knowns.sort(
          (a, b) => b.stat.mtime!.getTime() - a.stat.mtime!.getTime()
        );
      // group
      const groups = createSortedGroup(knowns, (file) =>
        toDateString(file.stat.mtime!)
      );
      groups.push({
        name: "unknown",
        files: unknowns,
      });
      //
      return groups;
    },
  },
];