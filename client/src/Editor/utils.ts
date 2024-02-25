import { UpdateFiles } from "../GlobalContext";
import { EditorProps } from "./types";
import { iFile } from "../types";

export const update = (
  seleteds: iFile[],
  updateFiles: UpdateFiles,
  newMoreDetails: object,
  formName?: EditorProps<any>["formName"] | false
) =>
  updateFiles(
    seleteds.map((file) => {
      const newDetails = { ...file.details, ...newMoreDetails };
      return [file, newDetails, formName ? formName(newDetails) : null];
    })
  );

export const updateFileName = (
  files: iFile[],
  updateFiles: UpdateFiles,
  newFileName: string
) => updateFiles(files.map((file) => [file, file.details, newFileName]));
