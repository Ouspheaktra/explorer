import { UpdateFiles, useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./Editor/types";
import { iFile } from "../types";

export function RenameEditor({ selecteds }: EditorComponentProps) {
  const { updateFiles } = useGlobal();
  return (
    <div>
      <label className="label">rename</label>
      <input
        className={`filename-input`}
        defaultValue={selecteds[0].name}
        placeholder={"new filename"}
        onKeyUp={(e) => {
          if (e.key === "Enter") {
            updateFileName(
              selecteds,
              updateFiles,
              e.currentTarget.value.trim()
            );
            e.currentTarget.value = "";
          }
        }}
      />
    </div>
  );
}

function updateFileName(
  files: iFile[],
  updateFiles: UpdateFiles,
  newFileName: string
) {
  updateFiles(files.map((file) => [file, file.details, newFileName]));
}
