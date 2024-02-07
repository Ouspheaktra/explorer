import List from "../List";
import { createSort } from "../List/utils";
import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";
import { iImageDetails } from "./types";
import { FileComponentProps } from "../List/types";
import { fileUrl } from "../utils";

function FileRender({
  fullMode,
  file: { fullname, path },
}: FileComponentProps) {
  if (fullMode)
    return (
      <div className="image-thumbnail">
        <img src={fileUrl(path)} />
        <span>{fullname}</span>
      </div>
    );
  else return fullname;
}

export default function ImageAlbum() {
  const { file, setViewerMode } = useGlobal();
  return (
    <List
      id="image-album"
      FileComponent={FileRender}
      listTop={file && <li onClick={() => setViewerMode(false)}>===</li>}
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.details.avatars[0].localeCompare(b.details.avatars[0])
          ),
        },
      ]}
    />
  );
}
