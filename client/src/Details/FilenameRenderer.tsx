import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { updateFileName } from "./utils";

export function FilenameDetails<iDetails extends object>({
  selecteds,
}: RendererProps<iDetails>) {
  const { updateFiles } = useGlobal();
  const file = selecteds.length === 1 ? selecteds[0] : null;
  return (
    <input
      className={`filename-input`}
      defaultValue={file?.name}
      placeholder={"Filename"}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          updateFileName(selecteds, updateFiles, e.currentTarget.value.trim());
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
