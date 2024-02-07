import { objectToQuery } from ".";
import { iDir, iFile } from "../types";

export const getDir = (dir: string): Promise<iDir> =>
  fetch(`/api/dir?${objectToQuery({ dir })}`).then((res) => res.json());

export const postFile = (
  file: iFile,
  details: iFile["details"],
  newName: string | null
): Promise<iFile> =>
  fetch("/api/file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file,
      details,
      newName,
    }),
  }).then((response) => response.json());