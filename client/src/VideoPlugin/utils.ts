import { UpdateFiles } from "../GlobalContext";
import { ObjectLiteral, iFile } from "../types";

export function updateFile(
  updateFiles: UpdateFiles,
  file: iFile,
  moreDetails: ObjectLiteral
) {
  updateFiles(
    [
      [
        file,
        {
          ...file.details,
          ...moreDetails,
        },
        null,
      ],
    ],
    true
  );
}
