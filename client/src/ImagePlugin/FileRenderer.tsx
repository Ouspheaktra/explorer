import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { iFile } from "../types";
import { iImageDetails } from "./types";
import { fileUrl } from "../utils";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

function FileFullMode({
  file: { fullname, path, details },
}: {
  file: iFile<iImageDetails>;
}) {
  const [loadImg, setToLoad] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
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
      className={"image-thumbnail" + (details.editeds?.length ? " edited" : "")}
      ref={elRef}
    >
      {loadImg && <img src={fileUrl(path)} />}
      <span>{fullname}</span>
    </div>
  );
}
