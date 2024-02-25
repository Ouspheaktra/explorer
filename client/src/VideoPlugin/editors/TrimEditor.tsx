import { useState } from "react";
import { EditorComponentProps } from "../../Editor/types";
import { secondsToString as str } from "../../utils";
import { useGlobal } from "../../GlobalContext";

export default function TrimEditor({ selecteds }: EditorComponentProps) {
  const { commandFiles } = useGlobal();
  const [parts, setParts] = useState<[number, number][]>([]);
  reMarker(parts);
  if (selecteds.length <= 1)
    return (
      <div
        style={{
          display: "flex",
        }}
      >
        <label className="label">trim</label>
        <div>
          {parts.length ? (
            <button
              style={{
                background: "aqua",
              }}
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
                  video().currentTime >= end
                    ? alert("start must < end")
                    : setParts(
                        parts.map((p, pid) =>
                          pid === id ? [video().currentTime, end] : p
                        )
                      )
                }
              >
                {str(start)}
              </button>
              -&gt;
              <button
                onClick={() =>
                  video().currentTime <= start
                    ? alert("end must > start")
                    : setParts(
                        parts.map((p, pid) =>
                          pid === id ? [start, video().currentTime] : p
                        )
                      )
                }
              >
                {str(end)}
              </button>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <button
                onClick={() => setParts(parts.filter((_, i) => i !== id))}
              >
                x
              </button>
            </div>
          ))}
          <button
            onClick={() =>
              setParts([
                ...parts,
                [
                  video().currentTime,
                  Math.min(video().currentTime + 60 * 5, video().duration),
                ],
              ])
            }
          >
            Add
          </button>
        </div>
      </div>
    );
  return <div></div>;
}

function reMarker(parts: [number, number][]) {
  const timebarContainer = document
      .getElementById("video")!
      .parentElement!.querySelector(".vp-timebar-container") as HTMLDivElement,
    { max } = timebarContainer.querySelector(".vp-timebar") as HTMLInputElement,
    more = timebarContainer.querySelector(".vp-more") as HTMLDivElement;
  more.innerHTML = "";
  let id = 0;
  for (let [start, end] of parts) {
    const marker = document.createElement("div");
    marker.className = "vp-marker";
    marker.style.backgroundColor = `hsl(${36 * id++}, 100%, 50%)`;
    const one = timebarContainer.clientWidth / +max;
    marker.style.left = one * start + "px";
    marker.style.width = one * end - one * start + "px";
    more.append(marker);
  }
}

function video() {
  return document.getElementById("video")! as HTMLVideoElement;
}
