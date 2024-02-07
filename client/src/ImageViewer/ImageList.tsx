import List from "../List";
import { createSort } from "../List/utils";
import { useGlobal } from "../GlobalContext";
import { FileComponentProps } from "../List/types";
import { fileUrl } from "../utils";

function FileRender({
  fullMode,
  file: { fullname, path },
}: FileComponentProps) {
  if (fullMode)
    return (
      <div className="image-thumbnail">
        <img src={fileUrl(path)} loading="lazy" />
        <span>{fullname}</span>
      </div>
    );
  else return fullname;
}

export default function ImageList() {
  const { file, setViewerMode } = useGlobal();
  return (
    <List
      id="image-list"
      FileComponent={FileRender}
      topButtons={
        file && <button onClick={() => setViewerMode(false)}>Close</button>
      }
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
