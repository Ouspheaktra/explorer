import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";

type DetailsTypeType = "string" | "string[]";
type DetailsType<iDetails extends object> = {
  name: keyof iDetails;
  type: DetailsTypeType;
  toFormName?: boolean;
};

export default function Details<iDetails extends object>({
  files,
  detailsTypes,
  formName,
}: {
  files: iFile[];
  detailsTypes: DetailsType<iDetails>[];
  formName: (details: iDetails) => string;
}) {
  const { dir, updateFiles } = useGlobal();
  const update = (
    name: string,
    value: any,
    { toFormName }: DetailsType<iDetails>
  ) => {
    if (name === "title")
      return updateFiles(files.map((file) => [file, file.details, value]));
    return updateFiles(
      files.map((file) => {
        const newDetails = { ...file.details, [name]: value };
        return [
          file,
          newDetails,
          toFormName ? formName(newDetails as iDetails) : null,
        ];
      })
    );
  };
  return (
    <div id="details">
      {detailsTypes.map((detailsType) => {
        const { type } = detailsType;
        let name = detailsType.name as string;
        return (
          <div key={name} className={`${type}-wrapper ${name}-wrapper`}>
            {(() => {
              if (type === "string[]") {
                const pluralName = name;
                if (name.endsWith("s")) name = name.slice(0, -1);
                const data: string[] =
                  files.length === 1 ? files[0].details[pluralName] || [] : [];
                return (
                  <>
                    {data.map((one) => (
                      <span key={one} className={`${type} ${name}`}>
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
                      className={`${type}-input ${name}-input`}
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
                          dir.files
                            .map((file) => file.details[pluralName] || [])
                            .flat()
                        ),
                      ].map((one) => (
                        <option key={one}>{one}</option>
                      ))}
                    </datalist>
                  </>
                );
              } else if (type === "string") {
                const file = files.length === 1 ? files[0] : null;
                return (
                  <input
                    className={`${type}-input ${name}-input`}
                    defaultValue={
                      (name === "title" ? file?.name : file?.details[name]) ||
                      ""
                    }
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
              } else return "no type = " + type;
            })()}
          </div>
        );
      })}
    </div>
  );
}
