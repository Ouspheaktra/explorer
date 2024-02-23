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
  [filename: string]: ObjectLiteral;
}
interface iFileParts {
  name: string;
  ext: string;
  dir: string;
}
export interface iFile extends iFileParts {
  stat: ObjectLiteral;
  details: ObjectLiteral;
}

export const getFileParts = (file: string): iFileParts => {
  const parts = file.split("/"),
    filename = parts.at(-1)!,
    filenameSplit = filename.split("."),
    name =
      filenameSplit.length > 1
        ? filenameSplit.slice(0, -1).join(".")
        : filename,
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
  const { dir, name, ext } = getFileParts(file);
  let stat = {};
  try {
    stat = fs.statSync(ext ? dir + "/" + name + ext : dir);
  } catch {}
  return {
    dir,
    name,
    ext,
    stat,
    details: filesData[name + ext] || {},
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

export const dataURLtoFile = (dataUrl: string, filePath: string) => {
  const dataBuffer = Buffer.from(
    dataUrl.slice("data:image/jpeg;base64,".length),
    "base64"
  );
  fs.writeFileSync(filePath, dataBuffer);
  return filePath;
};

export const removeThumbnails = ({ dir, name, ext }: iFile) => {
  const thumbnailDir = dir + "/.explorer/thumbnails/",
    fullname = name + ext;
  fs.readdirSync(thumbnailDir).forEach(
    (filename) =>
      filename.startsWith(fullname) && fs.rmSync(thumbnailDir + filename)
  );
};

export const replaceAll = (string: string, find: string, replace: string) =>
  string.replace(new RegExp(escapeRegExp(find), "g"), replace);

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export const findAvailableName = (dir: string, name: string, ext: string) => {
  let nameWithSuffix = name,
    suffix = 1;
  while (fs.existsSync(dir + "/" + nameWithSuffix + ext))
    nameWithSuffix = name + " - " + ++suffix;
  return nameWithSuffix;
};
