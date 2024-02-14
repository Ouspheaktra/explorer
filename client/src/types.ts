import { FC } from "react";

export type FileType = "image" | "video" | "unknown" | "dir";

export type ObjectLiteral = {
  [key: string]: any;
};

export interface iFile<DetailsType extends ObjectLiteral = ObjectLiteral> {
  _id: number;
  name: string;
  ext: string;
  dir: string;
  fullname: string;
  path: string;
  type: FileType;
  deleted?: boolean;
  stat: {
    mtime?: Date;
  };
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

export type AppState = {
  dir: iDir | null;
  file: iFile | null;
  viewerMode: boolean;
}

export interface Plugin {
  type: string;
  Viewer: FC;
  List: FC;
}
