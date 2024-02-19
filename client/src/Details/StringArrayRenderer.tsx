import { useGlobal } from "../GlobalContext";
import { RendererProps } from "./types";
import { update } from "./utils";

export default function StringArrayRenderer<iDetails extends object>({
  selecteds,
  detailsType,
  formName,
}: RendererProps<iDetails>) {
  const {
    dir: { files: allFiles },
    updateFiles,
  } = useGlobal();
  let name = detailsType.name as string;
  const pluralName = name;
  if (name.endsWith("s")) name = name.slice(0, -1);
  const data: string[] =
    selecteds.length === 1 ? selecteds[0].details[pluralName] || [] : [];
  const myUpdate = (name: string, value: string[]) =>
    update(
      selecteds,
      updateFiles,
      { [name]: value },
      detailsType.toFormName && formName
    );
  return (
    <>
      {/* LIST */}
      {data.map((one) => (
        <span key={one} className={`${name}`}>
          <button
            className="x"
            onClick={() =>
              myUpdate(
                pluralName,
                data.filter((a) => a !== one)
              )
            }
          >
            &times;
          </button>
          {one}
        </span>
      ))}
      {/* INPUT */}
      <input
        className={`${name}-input`}
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
    </>
  );
}
