import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { updateFileName } from "./utils";

export function FilenameDetails<iDetails extends object>({
  selecteds,
}: RendererProps<iDetails>) {
  const { updateFiles } = useGlobal();
  return (
    <input
      className={`filename-input`}
      defaultValue={selecteds[0].name}
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
