import { AppState, FileType, ObjectLiteral, iFile } from "../types";
import { mimeTypes } from "../../../src/utils";

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const toggleValue = (array: any[], value: any) => {
  const index = array.indexOf(value);
  if (index !== -1) array.splice(index, 1);
  else array.push(value);
  return array;
};

export const promisesAllOneByOne = async <T>(
  promises: Iterable<T | PromiseLike<T>>
): Promise<Awaited<T>[]> => {
  const results = [];
  for (const promise of promises) {
    const result = await promise;
    results.push(result);
  }
  return results;
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

export const prepareFile = (file: iFile) => {
  file.fullname = file.name + file.ext;
  file.type = extToType(file.ext);
  file.path = file.ext ? file.dir + "/" + file.fullname : file.dir;
  if (file.stat.mtime) file.stat.mtime = new Date(file.stat.mtime);
  return file;
};

export const pad2 = (number: number) =>
  Math.floor(number).toString().padStart(2, "0");

export const secondsToString = (seconds: number) =>
  `${pad2(seconds / 3600)}:${pad2((seconds / 60) % 60)}:${pad2(seconds % 60)}`;

export const toDateString = (date: Date) => date.toISOString().slice(0, 10);

export const sameDate = (date1: Date, date2: Date) =>
  date1.getFullYear() === date2.getFullYear() &&
  date1.getMonth() === date2.getMonth() &&
  date1.getDate() === date2.getDate();

export const setTitle = ({ dir, file }: AppState) =>
  (document.title = file ? file.fullname : dir ? dir.dir : "Explorer");

export const pushHistory = (state: AppState, isPush: boolean = true) => {
  const { dir, file, viewerMode } = state;
  const q = objectToQuery({
    dir: dir ? dir.dir : "",
    file: file ? file.fullname : "",
    viewerMode,
  });
  if (isPush) history.pushState({}, "", `/?${q}`);
  else history.replaceState({}, "", `/?${q}`);
  setTitle(state);
};

export const thumbnailUrl = ({ dir, fullname }: iFile, id: number) => 
  `/thumbnail?${new URLSearchParams({ dir, filename: fullname, id: "" + id }).toString()}`