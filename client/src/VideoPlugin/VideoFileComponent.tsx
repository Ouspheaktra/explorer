import { FileComponentProps } from "../List/types";
import Thumbnail from "../componenets/Thumbnail";
import { createThumbnail } from "./editors/ReThumbnailEditor";

export default function VideoFileComponent({ fullMode, file }: FileComponentProps) {
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
