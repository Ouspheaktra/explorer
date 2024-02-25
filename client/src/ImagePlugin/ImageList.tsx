import List from "../List";
import { createSort } from "../List/utils";
import EditedEditor from "./editors/EditedEditor";
import { useGlobal } from "../GlobalContext";
import ImageFileComponent from "./ImageFileComponent";
import { useRef } from "react";
import { Plugin, iFile } from "../types";

const ImageList: Plugin["List"] = ({ closeButton }) => {
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
    <List
      id="image-list"
      filteredFiles={filesStore.current}
      FileComponent={ImageFileComponent}
      topButtons={closeButton}
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.details.avatars[0].localeCompare(b.details.avatars[0])
          ),
        },
      ]}
      EditorComponents={[
        EditedEditor
      ]}
      // details={{
      //   formName: ({ avatars }) =>
      //     avatars && avatars.length ? avatars.join(" - ") : "",
      //   detailsTypes: [
      //     {
      //       name: "avatars",
      //       Renderer: StringArrayRenderer,
      //       toFormName: true,
      //     },
      //     {
      //       name: "editeds",
      //       Renderer: EditedsRenderer,
      //     },
      //   ],
      // }}
    />
  );
};

export default ImageList;
