import { useEffect, useRef, useState } from "react";
import { thumbnailUrl } from "../../utils";
import { iFile } from "../../types";
import { postThumbnails } from "../../utils/api";
import "./style.scss";

export default function Thumbnail({
  file,
  maxThumbnails,
  createThumbnail,
}: {
  file: iFile;
  maxThumbnails: number;
  createThumbnail: () => Promise<string[]>;
}) {
  const [toLoad, setToLoad] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const elRef = useRef<HTMLDivElement | null>(null);
  const isErrorRef = useRef(false);
  const intervalRef = useRef(0);
  const thumbnailId = useRef(0);
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
      className={"thumbnail" + (isLandscape ? "" : " portrait")}
      ref={elRef}
      onMouseEnter={
        maxThumbnails === 1
          ? undefined
          : (e) => {
              const img = e.currentTarget
                .firstElementChild! as HTMLImageElement;
              if (isErrorRef.current || img.tagName !== "IMG") return;
              intervalRef.current = setInterval(() => {
                thumbnailId.current = (thumbnailId.current + 1) % maxThumbnails;
                img.src = thumbnailUrl(file, thumbnailId.current);
              }, 1000) as unknown as number;
            }
      }
      onMouseLeave={
        maxThumbnails === 1
          ? undefined
          : (e) => {
              clearInterval(intervalRef.current);
              const img = e.currentTarget
                .firstElementChild! as HTMLImageElement;
              if (isErrorRef.current || img.tagName !== "IMG") return;
              thumbnailId.current = 0;
              img.src = thumbnailUrl(file, thumbnailId.current);
            }
      }
    >
      {toLoad && (
        <img
          src={thumbnailUrl(file, thumbnailId.current)}
          onLoad={(e) => {
            const { naturalWidth, naturalHeight } = e.currentTarget;
            if (naturalWidth < naturalHeight) setIsLandscape(false);
          }}
          onError={async (e) => {
            if (isErrorRef.current) return;
            isErrorRef.current = true;
            const imgs = await createThumbnail();
            await postThumbnails(file, imgs);
            e.currentTarget.src = thumbnailUrl(file, 0);
            isErrorRef.current = false;
          }}
        />
      )}
      <span>
        {file.fullname} {convertFileSize(file.stat.size)}
      </span>
    </div>
  );
}

function convertFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const decimals = 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));

  return `${size} ${sizes[i]}`;
}
