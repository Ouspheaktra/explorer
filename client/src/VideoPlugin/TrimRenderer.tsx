import { Fragment, useState } from "react";
import { RendererProps } from "../Details/types";
import { secondsToString as str } from "../utils";
import { useGlobal } from "../GlobalContext";

export default function TrimRenderer({ selecteds }: RendererProps<any>) {
  const { commandFiles } = useGlobal();
  const [parts, setParts] = useState<[number, number][]>([]);
  const video = document.getElementById("video")! as HTMLVideoElement;
  if (selecteds.length <= 1)
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        {parts.length ? (
          <button
            onClick={() => {
              const sorted = [...parts];
              sorted.sort((a, b) => a[0] - b[0]);
              commandFiles(
                selecteds,
                sorted
                  .map(
                    ([start, end]) =>
                      // prettier-ignore
                      `ffmpeg -ss ${str(start)} -to ${str(end)} -i {input} -c copy {output#}`
                  )
                  .join(" && ")
              );
            }}
          >
            Trim
          </button>
        ) : null}
        {parts.map(([start, end], id) => (
          <div key={id}>
            <button
              onClick={() =>
                video.currentTime >= end
                  ? alert("start must < end")
                  : setParts(
                      parts.map((p, pid) =>
                        pid === id ? [video.currentTime, end] : p
                      )
                    )
              }
            >
              {str(start)}
            </button>
            -&gt;
            <button
              onClick={() =>
                video.currentTime <= start
                  ? alert("end must > start")
                  : setParts(
                      parts.map((p, pid) =>
                        pid === id ? [start, video.currentTime] : p
                      )
                    )
              }
            >
              {str(end)}
            </button>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <button onClick={() => setParts(parts.filter((_, i) => i !== id))}>
              x
            </button>
          </div>
        ))}
        <button
          onClick={() =>
            setParts([
              ...parts,
              [
                video.currentTime,
                Math.min(video.currentTime + 60 * 5, video.duration),
              ],
            ])
          }
        >
          Add
        </button>
      </div>
    );
  return <div></div>;
}
