import { UpdateFiles } from "../GlobalContext";
import { DetailsProps } from "./types";
import { iFile } from "../types";

export const update = (
  files: iFile[],
  updateFiles: UpdateFiles,
  newMoreDetails: object,
  formName?: DetailsProps<any>["formName"] | false
) =>
  updateFiles(
    files.map((file) => {
      const newDetails = { ...file.details, ...newMoreDetails };
      return [file, newDetails, formName ? formName(newDetails) : null];
    })
  );

export const updateFileName = (
  files: iFile[],
  updateFiles: UpdateFiles,
  newFileName: string
) => updateFiles(files.map((file) => [file, file.details, newFileName]));
