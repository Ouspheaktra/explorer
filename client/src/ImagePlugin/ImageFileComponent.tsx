import { FileComponentProps } from "../List/types";
import { fileUrl } from "../utils";
import Thumbnail from "../componenets/Thumbnail";

export default function ImageFileComponent({ fullMode, file }: FileComponentProps) {
  if (fullMode)
    return (
      <Thumbnail
        className={file.details.editeds?.length ? "edited" : ""}
        file={file}
        maxThumbnails={1}
        createThumbnail={() =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = fileUrl(file.path);
            img.onload = function () {
              const canvas = document.createElement("canvas");
              const ctx = canvas.getContext("2d")!;
              const { naturalWidth, naturalHeight } = img;
              if (naturalWidth > naturalHeight) {
                canvas.width = (200 / naturalHeight) * naturalWidth;
                canvas.height = 200;
              } else {
                canvas.width = 200;
                canvas.height = (200 / naturalWidth) * naturalHeight;
              }
              ctx.drawImage(
                img,
                0,
                0,
                img.width,
                img.height,
                0,
                0,
                canvas.width,
                canvas.height
              );
              resolve([canvas.toDataURL("image/jpeg")]);
            };
          })
        }
      />
    );
  else return file.fullname;
}
