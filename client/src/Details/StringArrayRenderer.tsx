import { DetailProps } from "./types";

export default function StringArrayRenderer<iDetails extends object>({
  allFiles,
  selecteds,
  update,
  detailsType,
}: DetailProps<iDetails>) {
  let name = detailsType.name as string;
  const pluralName = name;
  if (name.endsWith("s")) name = name.slice(0, -1);
  const data: string[] =
    selecteds.length === 1 ? selecteds[0].details[pluralName] || [] : [];
  return (
    <>
      {data.map((one) => (
        <span key={one} className={`${name}`}>
          <button
            className="x"
            onClick={() =>
              update(
                pluralName,
                data.filter((a) => a !== one),
                detailsType
              )
            }
          >
            &times;
          </button>
          {one}
        </span>
      ))}
      <input
        className={`${name}-input`}
        placeholder={name}
        list={`details-${pluralName}`}
        onKeyUp={(e) => {
          if (e.key === "Enter" && e.currentTarget.value.trim()) {
            update(
              pluralName,
              [...data, e.currentTarget.value.trim()].sort(),
              detailsType
            );
            e.currentTarget.value = "";
          }
        }}
      />
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
