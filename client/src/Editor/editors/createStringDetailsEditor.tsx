import { useEffect, useRef } from "react";
import { useGlobal } from "../../GlobalContext";
import { updateDetails } from "../utils";
import { EditorComponentProps, createDetailsEditor } from "../types";

const createStringDetailsEditor: createDetailsEditor = (_name, formName) => {
  function StringDetailsEditor({ selecteds }: EditorComponentProps) {
    const { updateFiles } = useGlobal();
    const inputRef = useRef<HTMLInputElement | null>(null);
    const name = _name as string;
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
            updateDetails(
              selecteds,
              updateFiles,
              { [name]: e.currentTarget.value.trim() },
              formName
            );
            e.currentTarget.value = "";
          }
        }}
      />
    );
  }
  StringDetailsEditor.displayName = `${_name as string}DetailsEditor`;
  return StringDetailsEditor;
};

export default createStringDetailsEditor;
