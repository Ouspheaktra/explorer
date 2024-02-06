import { FileType, ObjectLiteral, iDir, iFile } from "./types";
import { mimeTypes } from "../../src/utils";

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const extToType = (ext: string) =>
  (ext
    ? (Object.entries(mimeTypes).find(([_type, mimes]) =>
        Object.keys(mimes).some((e) => e === ext)
      ) || ["unknown"])[0]
    : "dir") as FileType;

export const dirToPrevDir = (dir: string) =>
  dir ? dir.split("/").slice(0, -1).join("/") : false;

export const fileUrl = (path: string) =>
  `/file?${new URLSearchParams({ path }).toString()}`;

export const objectToQuery = (obj: ObjectLiteral) =>
  new URLSearchParams(obj).toString();

export const gotoDir = (dir: string): Promise<iDir> =>
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

export const prepareFile = (file: iFile) => {
  file.type = extToType(file.ext);
  file.path = file.ext ? file.dir + "/" + file.name + file.ext : file.dir;
  if (file.stat.mtime)
    file.stat.mtime = new Date(file.stat.mtime);
  return file;
};

export const pad2 = (number: number) =>
  Math.floor(number).toString().padStart(2, "0");

export const secondsToString = (seconds: number) =>
  `${pad2(seconds / 3600)}:${pad2((seconds / 60) % 60)}:${pad2(seconds % 60)}`;

export const toDateString = (date: Date) =>
  date.toISOString().slice(0, 10);

export const sameDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();
