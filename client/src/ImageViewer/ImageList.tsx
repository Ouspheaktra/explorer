import { forwardRef } from "react";
import List from "../List";
import { createSort } from "../List/utils";
import { FileComponentProps, ListMethod } from "../List/types";
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

const ImageList = forwardRef<ListMethod>(function ImageList({}, ref) {
  return (
    <List
      ref={ref}
      id="image-list"
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
    />
  );
});

export default ImageList;
