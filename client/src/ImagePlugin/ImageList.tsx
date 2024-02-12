import { createSort } from "../List/utils";
import List from "../List";
import { iImageDetails } from "./types";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import EditedsRenderer from "./EditedsRenderer";
import { useGlobal } from "../GlobalContext";
import FileRender from "./FileRenderer";

export default function ImageList() {
  const {
    dir: { files },
  } = useGlobal();
  const editeds = files
    .filter((file) => file.details.editeds?.length)
    .map((file) => file.details.editeds)
    .flat();
  return (
    <List<iImageDetails>
      id="image-list"
      filteredFiles={files.filter(
        (file) => file.type === "image" && !editeds.includes(file.fullname)
      )}
      FileComponent={FileRender}
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.details.avatars[0].localeCompare(b.details.avatars[0])
          ),
        },
      ]}
      details={{
        formName: ({ avatars }) =>
          avatars && avatars.length ? avatars.join(" - ") : "",
        detailsTypes: [
          {
            name: "avatars",
            Renderer: StringArrayRenderer,
            toFormName: true,
          },
          {
            name: "editeds",
            Renderer: EditedsRenderer,
          },
        ],
      }}
    />
  );
}
