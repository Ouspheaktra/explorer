import { useEffect, useRef } from "react";
import { useGlobal } from "../GlobalContext";
import { EditorComponentProps } from "./types";
import { update } from "./utils";

export default function StringDetail<iDetails extends object>({
  selecteds,
  detailsType,
  formName,
}: EditorComponentProps<iDetails>) {
  const { updateFiles } = useGlobal();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const name = detailsType.name as string;
  useEffect(() => {
    inputRef.current!.value = selecteds[0].details[name] || "";
  }, [selecteds]);
  return (
    <input
      ref={inputRef}
      className={`${name}-input string-input`}
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
