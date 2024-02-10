import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";

type DetailsType = "string" | "string[]";

export default function Details<iDetails extends object>({
  files,
  detailsTypes,
  formName,
}: {
  files: iFile[];
  detailsTypes: {
    name: keyof iDetails;
    type: DetailsType;
  }[];
  formName: (details: iDetails) => string;
}) {
  const { dir, updateFiles } = useGlobal();
  const update = (name: string, value: any) => {
    if (name === "title")
      return updateFiles(files.map((file) => [file, file.details, value]));
    return updateFiles(
      files.map((file) => {
        const newDetails = { ...file.details, [name]: value };
        return [file, newDetails, formName(newDetails as iDetails)];
      })
    );
  };
  return (
    <div id="details">
      {detailsTypes.map((detailsType) => {
        let { name, type } = detailsType as {
          name: string;
          type: DetailsType;
        };
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
                              data.filter((a) => a !== one)
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
                            [...data, e.currentTarget.value.trim()].sort()
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
                        update(name, value);
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
