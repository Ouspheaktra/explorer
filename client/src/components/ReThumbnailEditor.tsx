import { EditorComponentProps } from "./Editor/types";
import { iFile } from "../types";
import { fileUrl } from "../utils";
import { postThumbnails } from "../utils/api";

export default function ReThumbnailEditor({ selecteds }: EditorComponentProps) {
  return (
    <div>
      <label className="label">rethumb</label>
      <button onClick={() => recreate(selecteds, 5)}>Re</button>
      <button onClick={async () => recreate(selecteds, 10)}>Re at 10%</button>
      <button onClick={async () => recreate(selecteds, 15)}>Re at 15%</button>
    </div>
  );
}

async function recreate(selecteds: iFile[], startPerc: number) {
  for (let file of selecteds) {
    const imgTags = Array.from(
      document.querySelectorAll(`img[data-file-id="${file._id}"]`)
    ) as HTMLImageElement[];
    const imgTagsSrc = imgTags.map((img) => img.src);
    imgTags.forEach((img) => (img.src = ""));
    //
    const imgs = await createThumbnail(file, startPerc, 10);
    await postThumbnails(file, imgs);
    //
    imgTags.forEach((img, id) => (img.src = imgTagsSrc[id] + "&" + Date.now()));
    console.log("rethumbnail at " + startPerc + "% done", file.name);
  }
}

export function createThumbnail(
  file: iFile,
  startPercentage: number,
  numThumbnails: number = 10
) {
  return new Promise<string[]>((resolve) => {
    const intervalPerc = (100 - startPercentage) / numThumbnails;
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
      for (let i = 0; i < numThumbnails; i++)
        await new Promise<void>((resolve) => {
          video.currentTime =
            ((startPercentage + i * intervalPerc) / 100) * video.duration;
          video.onseeked = async function () {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL("image/jpeg");
            imgs.push(image);
            resolve();
          };
        });
      resolve(imgs);
    };
  });
}
