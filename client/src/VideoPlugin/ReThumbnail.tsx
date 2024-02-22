import { RendererProps } from "../Details/types";
import { useGlobal } from "../GlobalContext";
import { iFile } from "../types";
import { fileUrl, rotateImage } from "../utils";

export default function ReThumbnail({ selecteds }: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  return (
    <div>
      <button
        onClick={() => commandFiles(selecteds, 'cp "{input}" "{output}"')}
      >
        Re-Thumbnail
      </button>
      <button
        onClick={async () => {
          commandFiles(selecteds, 'cp "{input}" "{output}"');
          for (let file of selecteds) await createThumbnail(file, 8, 10);
        }}
      >
        Re-Thumbnail every 8%
      </button>
    </div>
  );
}

export function createThumbnail(
  file: iFile,
  interval: number,
  numThumbnails: number = 10
) {
  return new Promise<string[]>((resolve) => {
    const video = document.createElement("video");
    video.src = fileUrl(file.path);
    video.ondurationchange = async () => {
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
  });
}
