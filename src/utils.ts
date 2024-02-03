import fs from "fs";

export const mimeTypes: {
  image: { [key: string]: string };
  video: { [key: string]: string };
} = {
  image: {
    ".jpg": "",
    ".jpeg": "",
    ".png": "",
    ".gif": "",
    ".webp": "",
    ".bmp": "",
  },
  video: {
    ".mp4": "video/mp4",
    ".mov": "video/quicktime",
    ".avi": "video/x-msvideo",
    ".wmv": "video/x-ms-wmv",
    ".flv": "video/x-flv",
    ".mkv": "video/x-matroska",
    ".3gp": "video/3gpp",
    ".webm": "video/webm",
    // ".ts": "video/mp2t",
  },
};

type ObjectLiteral = { [key: string]: any };
interface iFilesData {
  [id: string]: ObjectLiteral;
}
interface iFileParts {
  name: string;
  ext: string;
  dir: string;
}
export interface iFile extends iFileParts {
  id: number | null;
  details: ObjectLiteral;
}

export const getFileParts = (file: string): iFileParts => {
  const parts = file.split("/"),
    filename = parts.at(-1)!,
    filenameSplit = filename.split("."),
    name = filenameSplit.length > 1 ? filenameSplit.slice(0, -1).join(".") : filename,
    ext = filenameSplit.length > 1 ? "." + filenameSplit.at(-1) : "",
    dirs = ext ? parts.slice(0, -1) : parts,
    dir = dirs.join("/");
  return {
    name,
    ext,
    dir,
  };
};

export const getFileDetail = (file: string, filesData: iFilesData): iFile => {
  const parts = getFileParts(file);
  let id = null,
    name = parts.name;
  if (parts.ext) {
    const splitted = parts.name.split(" - ");
    if (splitted.length > 1) {
      id = parseInt(splitted.at(-1)!);
      name = splitted.slice(0, -1).join(" - ");
    }
  }
  return {
    ...parts,
    name,
    id,
    details: id ? filesData[id] : {},
  };
};

export const readFilesData = (dir: string): iFilesData => {
  try {
    const json = fs.readFileSync(dir + "/.explorer/files.json", "utf8");
    return JSON.parse(json);
  } catch (e: any) {
    if (e.code !== "ENOENT") throw e;
  }
  return {};
};

export const writeFilesData = (dir: string, data: iFilesData) => {
  try {
    fs.writeFileSync(dir + "/.explorer/files.json", JSON.stringify(data));
  } catch (err: any) {
    if (err.code === "ENOENT") {
      fs.mkdirSync(dir + "/.explorer/", { recursive: true });
      writeFilesData(dir, data);
    } else throw err;
  }
};

export const findMaxId = (obj: { [id: string]: any }) =>
  Math.max(
    1,
    ...Object.keys(obj)
      .map((s) => parseInt(s))
      .filter(Boolean)
  );
