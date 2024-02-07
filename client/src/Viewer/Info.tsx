import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";

type DetailsType = "string" | "string[]";

export default function Info<iDetails extends object>({
  detailsTypes,
  formName,
}: {
  detailsTypes: {
    name: keyof iDetails;
    type: DetailsType;
  }[];
  formName: (details: iDetails) => string;
}) {
  const {
    file,
    dir: { files },
    updateFile,
  } = useGlobal();
  const update = (details: iFile["details"]) => {
    const newDetails = { ...file.details, ...details };
    updateFile(file, newDetails, formName(newDetails as iDetails));
  };
  return (
    <div id="info">
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
                const data: string[] = file.details[pluralName] || [];
                return (
                  <>
                    {data.map((one) => (
                      <span key={one} className={`${type} ${name}`}>
                        <button
                          className="x"
                          onClick={() =>
                            update({
                              [pluralName]: data.filter((a) => a !== one),
                            })
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
                      list={`info-${pluralName}`}
                      onKeyUp={(e) => {
                        if (e.key === "Enter" && e.currentTarget.value.trim()) {
                          update({
                            [pluralName]: [
                              ...data,
                              e.currentTarget.value.trim(),
                            ].sort(),
                          });
                          e.currentTarget.value = "";
                        }
                      }}
                    />
                    <datalist id={`info-${pluralName}`}>
                      {[
                        ...new Set(
                          files
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
                return (
                  <input
                    className={`${type}-input ${name}-input`}
                    defaultValue={file.details[name] || ""}
                    placeholder={name}
                    onKeyUp={(e) => {
                      if (e.key === "Enter" && e.currentTarget.value.trim()) {
                        update({
                          [name]: e.currentTarget.value.trim(),
                        });
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
