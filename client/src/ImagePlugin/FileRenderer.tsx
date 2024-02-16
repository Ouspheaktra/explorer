import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { iFile } from "../types";
import { iImageDetails } from "./types";
import { fileUrl, thumbnailUrl } from "../utils";
import { postThumbnails } from "../utils/api";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

function FileFullMode({ file }: { file: iFile<iImageDetails> }) {
  const { fullname, details } = file;
  const [toLoad, setToLoad] = useState(false);
  const [isLandscape, setIsLandscape] = useState(true);
  const elRef = useRef<HTMLDivElement | null>(null);
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
      className={"image-thumbnail" + (details.editeds?.length ? " edited" : "") + (isLandscape ? "" : " portrait")}
      ref={elRef}
    >
      {toLoad && (
        <img
          src={thumbnailUrl(file, 0)}
          onLoad={(e) => {
            const {naturalWidth, naturalHeight} = e.currentTarget;
            if (naturalWidth < naturalHeight)
              setIsLandscape(false);
          }}
          onError={(e) => {
            if (errorNumberRef.current++ > 0) return;
            const mainImg = e.currentTarget;
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
              postThumbnails(file, [canvas.toDataURL("image/jpeg")]).then(
                () => (mainImg.src = mainImg.src)
              );
            };
          }}
        />
      )}
      <span>{fullname}</span>
    </div>
  );
}
