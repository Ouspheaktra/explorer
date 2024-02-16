import { createSort } from "../List/utils";
import List from "../List";
import { iImageDetails } from "./types";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import EditedsRenderer from "./EditedsRenderer";
import { useGlobal } from "../GlobalContext";
import FileRender from "./FileRenderer";
import { useRef } from "react";
import { iFile } from "../types";

export default function ImageList() {
  const {
    dir: { files },
  } = useGlobal();
  const filesStore = useRef<iFile[]>([]);
  if (files !== filesStore.current) {
    const editeds = files
      .filter((file) => file.details.editeds?.length)
      .map((file) => file.details.editeds)
      .flat();
    filesStore.current = files.filter(
      (file) => file.type === "image" && !editeds.includes(file.fullname)
    );
  }
  return (
    <List<iImageDetails>
      id="image-list"
      filteredFiles={filesStore.current}
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
