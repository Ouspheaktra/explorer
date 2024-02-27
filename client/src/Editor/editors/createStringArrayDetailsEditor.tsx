import { useGlobal } from "../../GlobalContext";
import { EditorComponentProps, createDetailsEditor } from "../types";
import { updateDetails } from "../utils";

const createStringArrayDetailsEditor: createDetailsEditor = (
  _name,
  formName
) => {
  function StringArrayDetailsEditor({ selecteds }: EditorComponentProps) {
    const {
      dir: { files: allFiles },
      updateFiles,
    } = useGlobal();
    let name = _name as string,
      pluralName = name;
    if (name.endsWith("s")) name = name.slice(0, -1);
    const data: string[] = selecteds[0].details[pluralName] || [];
    const myUpdate = (name: string, value: string[]) =>
      updateDetails(selecteds, updateFiles, { [name]: value }, formName);
    return (
      <div style={{ display: "flex" }}>
        <label className="label">{pluralName}</label>
        <div className={`${pluralName}-wrapper string-array-wrapper`}>
          {/* LIST */}
          {data.map((one) => (
            <span key={one} className={`${name} string-array`}>
              <button
                className="x auto-hide small fly-right"
                onClick={() =>
                  myUpdate(
                    pluralName,
                    data.filter((a) => a !== one)
                  )
                }
              ></button>
              {one}
            </span>
          ))}
          {/* INPUT */}
          <input
            className={`${name}-input string-array-input`}
            placeholder={name}
            list={`details-${pluralName}`}
            onKeyUp={(e) => {
              if (e.key === "Enter" && e.currentTarget.value.trim()) {
                myUpdate(
                  pluralName,
                  [...data, e.currentTarget.value.trim()].sort()
                );
                e.currentTarget.value = "";
              }
            }}
          />
          {/* DATA LIST */}
          <datalist id={`details-${pluralName}`}>
            {[
              ...new Set(
                allFiles.map((file) => file.details[pluralName] || []).flat()
              ),
            ].map((one) => (
              <option key={one}>{one}</option>
            ))}
          </datalist>
        </div>
      </div>
    );
  }
  StringArrayDetailsEditor.displayName = `${_name as string}DetailsEditor`;
  return StringArrayDetailsEditor;
};

export default createStringArrayDetailsEditor;
