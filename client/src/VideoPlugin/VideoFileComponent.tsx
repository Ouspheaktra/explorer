import { FileComponentProps } from "../components/List/types";
import Thumbnail from "../components/Thumbnail";
import { createThumbnail } from "../components/ReThumbnailEditor";

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
