import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { updateFileName } from "./utils";

export function FilenameDetails<iDetails extends object>({
  selecteds,
  detailsType,
}: RendererProps<iDetails>) {
  const {
    dir: { files },
    updateFiles,
  } = useGlobal();
  const name = detailsType.name as string;
  const file = selecteds.length === 1 ? selecteds[0] : null;
  return (
    <input
      className={`filename-input`}
      defaultValue={file?.name}
      placeholder={name}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          updateFileName(files, updateFiles, e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
