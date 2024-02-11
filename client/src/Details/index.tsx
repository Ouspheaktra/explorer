import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";
import { DetailsType, UpdateFn } from "./types";

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
  const update: UpdateFn<iDetails> = (name, value, { toFormName }) => {
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
        const { Renderer } = detailsType;
        let name = detailsType.name as string;
        return (
          <div key={name} className={`${name}-wrapper`}>
            <Renderer
              allFiles={dir.files}
              selecteds={files}
              detailsType={detailsType}
              update={update}
            />
          </div>
        );
      })}
    </div>
  );
}
