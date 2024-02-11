import { DetailProps } from "./types";

export function StringDetail<iDetails extends object>({
  selecteds,
  update,
  detailsType,
}: DetailProps<iDetails>) {
  const { Renderer: type } = detailsType;
  const name = detailsType.name as string;
  const file = selecteds.length === 1 ? selecteds[0] : null;
  return (
    <input
      className={`${type}-input ${name}-input`}
      defaultValue={(name === "title" ? file?.name : file?.details[name]) || ""}
      placeholder={name}
      onKeyUp={(e) => {
        if (e.key === "Enter") {
          const value = e.currentTarget.value.trim();
          e.currentTarget.value = "";
          update(name, value, detailsType);
        }
      }}
    />
  );
}