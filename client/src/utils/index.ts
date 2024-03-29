import { FileType, ObjectLiteral, iFile } from "../types";
import { mimeTypes } from "../../../src/utils";
import Bowser from "bowser";

export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

export const toggleItem = (array: any[], value: any) => {
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

const browser = Bowser.getParser(window.navigator.userAgent).getBrowserName();

export const fileUrl = (path: string) =>
  browser === "Firefox"
    ? "file://" + path
    : `/file?${new URLSearchParams({ path }).toString()}`;

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

export const thumbnailUrl = ({ dir, fullname }: iFile, id: number) =>
  `/file?${new URLSearchParams({
    path:
      dir +
      "/.explorer/thumbnails/" +
      fullname +
      "_" +
      id.toString().padStart(2, "0") +
      ".jpg",
  }).toString()}`;

export function rotateImage(dataURL: string, degree: number) {
  return new Promise<string>((resolve, reject) => {
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      var ctx = canvas.getContext("2d")!;

      // Set the canvas dimensions based on the rotated image
      if (degree % 180 === 90) {
        canvas.width = img.height;
        canvas.height = img.width;
      } else {
        canvas.width = img.width;
        canvas.height = img.height;
      }

      // Rotate the image
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((degree * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Get the data URL of the rotated image
      var rotatedDataURL = canvas.toDataURL("image/jpeg");

      // Resolve the promise with the rotated data URL
      resolve(rotatedDataURL);
    };
    img.onerror = function () {
      reject(new Error("Failed to load image"));
    };
    img.src = dataURL; // Set the source of the image to the original data URL
  });
}

export const notBoolean = (not: any, bool: boolean) => (not ? !bool : bool);
