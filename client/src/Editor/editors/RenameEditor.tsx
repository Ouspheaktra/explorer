import { UpdateFiles, useGlobal } from "../../GlobalContext";
import { EditorComponentProps } from "../types";
import { iFile } from "../../types";

export function RenameEditor({ selecteds }: EditorComponentProps) {
  const { updateFiles } = useGlobal();
  return (
    <input
      className={`filename-input`}
      defaultValue={selecteds[0].name}
      placeholder={"new filename"}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          updateFileName(selecteds, updateFiles, e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }
      }}
    />
  );
}

function updateFileName(
  files: iFile[],
  updateFiles: UpdateFiles,
  newFileName: string
) {
  updateFiles(files.map((file) => [file, file.details, newFileName]));
}
