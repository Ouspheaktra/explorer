import { FileComponentProps } from "../List/types";
import { fileUrl, rotateImage } from "../utils";
import Thumbnail from "../componenets/Thumbnail";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode)
    return (
      <Thumbnail
        file={file}
        maxThumbnails={10}
        createThumbnail={() =>
          new Promise((resolve) => {
            const video = document.createElement("video");
            video.src = fileUrl(file.path);
            video.ondurationchange = async () => {
              const interval = 9.5; // Interval in percentage
              const numThumbnails = 10; // Number of thumbnails
              const canvas = document.createElement("canvas");
              const context = canvas.getContext("2d")!;
              const { videoWidth, videoHeight } = video;
              if (videoWidth > videoHeight) {
                canvas.width = (200 / videoHeight) * videoWidth;
                canvas.height = 200;
              } else {
                canvas.width = 200;
                canvas.height = (200 / videoWidth) * videoHeight;
              }
              const imgs: string[] = [];
              for (let i = 1; i <= numThumbnails; i++)
                await new Promise<void>((resolve) => {
                  video.currentTime = ((i * interval) / 100) * video.duration;
                  video.onseeked = async function () {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    const image = canvas.toDataURL("image/jpeg");
                    imgs.push(
                      file.details.rotate
                        ? await rotateImage(image, file.details.rotate)
                        : image
                    );
                    resolve();
                  };
                });
              resolve(imgs);
            };
          })
        }
      />
    );
  else return file.fullname;
}
