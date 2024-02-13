import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { iFile } from "../types";
import { fileUrl } from "../utils";

export default function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

function FileFullMode({ file: { fullname, path } }: { file: iFile }) {
  const [toLoad, setToLoad] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  const intervalRef = useRef(0);
  const timeRef = useRef(0);
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
      className={"video-thumbnail"}
      ref={elRef}
      onMouseEnter={(e) => {
        const video = e.currentTarget.firstElementChild! as HTMLVideoElement;
        if (video.tagName !== "VIDEO") return;
        intervalRef.current = setInterval(() => {
          video.currentTime = timeRef.current =
            (timeRef.current + video.duration / 10) % video.duration;
        }, 1000) as unknown as number;
      }}
      onMouseLeave={() => clearInterval(intervalRef.current)}
    >
      {toLoad && (
        <video
          src={fileUrl(path)}
          onDurationChange={({ currentTarget: video }) => {
            video.currentTime = timeRef.current = video.duration / 10;
          }}
        />
      )}
      <span>{fullname}</span>
    </div>
  );
}
