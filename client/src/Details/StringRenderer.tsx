import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { update } from "./utils";

export default function StringDetail<iDetails extends object>({
  selecteds,
  detailsType,
  formName,
}: RendererProps<iDetails>) {
  const { updateFiles } = useGlobal();
  const name = detailsType.name as string;
  return (
    <input
      className={`${name}-input string-input`}
      defaultValue={selecteds[0].details[name] || ""}
      placeholder={name}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          update(
            selecteds,
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
