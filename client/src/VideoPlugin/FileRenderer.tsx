import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { iFile } from "../types";
import { fileUrl, thumbnailUrl } from "../utils";
import { postThumbnails } from "../utils/api";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

function FileFullMode({ file }: { file: iFile }) {
  const [toLoad, setToLoad] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const thumbnailId = useRef(0);
  const elRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef(0);
  const errorNumberRef = useRef(0);
  useEffect(() => {
    const scroll = () => {
      const elY = elRef.current!.offsetTop;
      if (
        window.scrollY - 50 < elY &&
        elY < window.scrollY + window.innerHeight
      ) {
        setToLoad(true);
        window.removeEventListener("scroll", scroll);
      }
    };
    window.addEventListener("scroll", scroll);
    scroll();
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <div
      className={"video-thumbnail" + (isLandscape ? "" : " portrait")}
      ref={elRef}
      onMouseEnter={(e) => {
        const img = e.currentTarget.firstElementChild! as HTMLImageElement;
        if (img.tagName !== "IMG" && img.complete) return;
        intervalRef.current = setInterval(() => {
          thumbnailId.current = (thumbnailId.current + 1) % 10;
          img.src = thumbnailUrl(file, thumbnailId.current);
        }, 1000) as unknown as number;
      }}
      onMouseLeave={() => clearInterval(intervalRef.current)}
    >
      {toLoad && (
        <img
          src={thumbnailUrl(file, thumbnailId.current)}
          onLoad={(e) => {
            const {naturalWidth, naturalHeight} = e.currentTarget;
            if (naturalWidth < naturalHeight)
              setIsLandscape(false);
          }}
          onError={async (e) => {
            if (errorNumberRef.current++ > 0) return;
            const mainImg = e.currentTarget;
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
              const datas: string[] = [];
              for (let i = 1; i <= numThumbnails; i++)
                await new Promise<void>((resolve) => {
                  video.currentTime = ((i * interval) / 100) * video.duration;
                  video.onseeked = function () {
                    context.drawImage(video, 0, 0, canvas.width, canvas.height);
                    datas.push(canvas.toDataURL("image/jpeg"));
                    resolve();
                  };
                });
              postThumbnails(file, datas).then(
                () => (mainImg.src = thumbnailUrl(file, thumbnailId.current))
              );
            };
          }}
        />
      )}
      <span>{file.fullname}</span>
    </div>
  );
}
