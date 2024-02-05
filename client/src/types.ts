export type FileType = "image" | "video" | "unknown" | "dir";

export type ObjectLiteral = {
  [key: string]: any;
};

export interface iFile<DetailsType = ObjectLiteral> {
  _id: number;
  name: string;
  ext: string;
  dir: string;
  path: string;
  type: FileType;
  details: DetailsType;
}

export interface iDir {
  dir: string;
  prevDir: string | false;
  files: iFile[];
}

export interface iData {
  dir: iDir;
  file: iFile;
}
