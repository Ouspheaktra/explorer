import { FileComponentProps } from "../List/types";
import Thumbnail from "../componenets/Thumbnail";
import { createThumbnail } from "./ReThumbnail";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode)
    return (
      <Thumbnail
        file={file}
        maxThumbnails={10}
        createThumbnail={() => createThumbnail(file, 5, 10)}
      />
    );
  else return file.fullname;
}
