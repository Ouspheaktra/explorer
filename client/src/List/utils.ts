import { iFile } from "../types";
import { Sort } from "./types";

export const createSort =
  (
    groupName: (file: iFile) => string | false,
    sort: Parameters<Array<iFile>["sort"]>[0]
  ): Sort["sort"] =>
  (files) => {
    const groups: { [key: string]: iFile[] } = {};
    const unknown: iFile[] = [];
    for (let file of files) {
      const name = groupName(file);
      if (name === false) unknown.push(file);
      else if (groups[name]) groups[name].push(file);
      else groups[name] = [file];
    }
    return (
      Object.entries(groups)
        // sort group by name
        .sort(([a], [b]) => a.localeCompare(b))
        //
        .map(([name, files]) => ({
          name,
          files: files.sort(sort),
        }))
        // add unknown
        .concat({ name: "unknown", files: unknown })
    );
  };
