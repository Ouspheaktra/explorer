import { FC, HTMLProps, ReactNode } from "react";
import { iFile } from "../../types";
import { EditorProps } from "../Editor/types";

export interface FilterRegexGroup {
  not: string | undefined,
  detail: string | undefined,
  word: string,
}

export type Order = "asc" | "desc";
export type SortedGroup = {
  name: string;
  files: iFile[];
};
export type Sort = {
  name: string;
  sort: (files: iFile[]) => SortedGroup[];
};

export interface FileComponentProps {
  fullMode: boolean;
  file: iFile;
}

export interface ListMethod {
  next(plus: number): void;
}

export type ListProps = HTMLProps<HTMLUListElement> & {
  FileComponent: FC<FileComponentProps>;
  listTop?: ReactNode;
  topButtons?: ReactNode;
  bottomButtons?: ReactNode;
  sorts?: Sort[];
  filteredFiles: iFile[];
  EditorComponents: EditorProps["Components"];
};
