import List from "../List";
import { createSortedGroup } from "../List/utils";
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
        <span>
          {fullname}
        </span>
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
          showLabel: true,
          sort: (files, order) => {
            //
            const knowns: iFile<iImageDetails>[] = [],
              unknowns: iFile[] = [];
            for (let file of files as iFile<iImageDetails>[])
              if (file.details.avatars && file.details.avatars.length)
                knowns.push(file);
              else unknowns.push(file);
            // sort
            if (order === "asc")
              knowns.sort((a, b) =>
                a.details.avatars![0].localeCompare(b.details.avatars![0])
              );
            else
              knowns.sort((a, b) =>
                b.details.avatars![0].localeCompare(a.details.avatars![0])
              );
            // group
            const groups = createSortedGroup(
              knowns,
              (file) => file.details.avatars[0]
            );
            groups.push({
              name: "unknown",
              files: unknowns,
            });
            //
            return groups;
          },
        },
      ]}
    />
  );
}
