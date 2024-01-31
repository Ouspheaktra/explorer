import { useGlobal } from "../contexts/GlobalContext";
import { iFile } from "../types";

export default function Info({
  detailsTypes,
  formNewName,
}: {
  detailsTypes: {
    name: string;
    type: "string" | "string[]";
  }[];
  formNewName: (details: iFile["details"]) => string;
}) {
  const {
    file,
    dir: { files },
    updateFile,
  } = useGlobal();
  const update = (details: iFile["details"]) => {
    const newDetails = { ...file.details, ...details };
    updateFile(file, newDetails, formNewName(newDetails));
  };
  return (
    <div id="info">
      {detailsTypes.map(({ name, type }) => {
        if (type === "string[]") {
          const pluralName = name;
          if (name.endsWith("s")) name = name.slice(0, -1);
          const data: string[] = file.details[pluralName] || [];
          return (
            <div key={pluralName} className={`string[]-wrapper ${pluralName}-wrapper`}>
              {data.map((one) => (
                <span key={one} className={`string ${name}`}>
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
                className={`string-input ${name}-input`}
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
                    files.map((file) => file.details[pluralName] || []).flat()
                  ),
                ].map((one) => (
                  <option key={one}>{one}</option>
                ))}
              </datalist>
            </div>
          );
        }
        // else if (type === "string")
        else return "no type = " + type;
      })}
    </div>
  );
}
