import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { update } from "./utils";

export function StringDetail<iDetails extends object>({
  selecteds,
  detailsType,
  formName,
}: RendererProps<iDetails>) {
  const {
    dir: { files },
    updateFiles,
  } = useGlobal();
  const name = detailsType.name as string;
  const file = selecteds.length === 1 ? selecteds[0] : null;
  return (
    <input
      className={`${name}-input`}
      defaultValue={file?.details[name] || ""}
      placeholder={name}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          update(
            files,
            updateFiles,
            { [name]: e.currentTarget.value.trim() },
            detailsType.toFormName && formName
          );
          e.currentTarget.value = "";
        }
      }}
    />
  );
}
