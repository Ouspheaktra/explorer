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

export const deleteFile = (file: iFile): Promise<Response> =>
  fetch("/api/file", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file,
    }),
  });

export const postThumbnails = (
  file: iFile,
  datas: string[]
): Promise<Response> =>
  fetch("/api/thumbnails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file,
      datas,
    }),
  });

export const postCommand = (file: iFile, command: string) =>
  fetch("/api/command", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      file,
      command,
    }),
  });
