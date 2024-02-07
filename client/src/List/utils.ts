import { iFile } from "../types";
import { SortedGroup } from "./types";

export function createSortedGroup(
  files: iFile[],
  makeGroupName: (file: iFile) => string
) {
  const groups: SortedGroup[] = [];
  for (let file of files) {
    const groupName = makeGroupName(file);
    if (groups.at(-1) && groups.at(-1)!.name === groupName)
      groups.at(-1)!.files.push(file);
    else
      groups.push({
        name: groupName,
        files: [file],
      });
  }
  return groups;
}
