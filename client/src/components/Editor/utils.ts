import { formName } from "./types";
import { iFile } from "../../types";
import { UpdateFiles } from "../../GlobalContext";

export const updateDetails = (
  seleteds: iFile[],
  updateFiles: UpdateFiles,
  newMoreDetails: object,
  formName?: formName<any>
) =>
  updateFiles(
    seleteds.map((file) => {
      const newDetails = { ...file.details, ...newMoreDetails };
      return [file, newDetails, formName ? formName(newDetails) : null];
    })
  );
