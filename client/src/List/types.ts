import { ComponentProps, FC, HTMLProps, ReactNode } from "react";
import { iFile } from "../types";
import Details from "../Details";

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

export type ListProps<iDetailsType extends object> = HTMLProps<HTMLUListElement> & {
  FileComponent: FC<FileComponentProps>;
  listTop?: ReactNode;
  topButtons?: ReactNode;
  bottomButtons?: ReactNode;
  sorts?: Sort[];
  filteredFiles: iFile[];
  details?: Pick<
    ComponentProps<typeof Details<iDetailsType>>,
    "detailsTypes" | "formName"
  >;
};
