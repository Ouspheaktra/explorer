import { CSSProperties, useEffect, useRef, useState } from "react";
import panzoom, { PanZoom } from "panzoom";
import { useGlobal } from "../GlobalContext";
import { fileUrl } from "../utils";

export default function ImageViewer() {
  const {
    file: { _id, path, dir, details },
  } = useGlobal();
  const [editedId, setEditedId] = useState(0);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panzoomHandle = useRef<PanZoom>();
  useEffect(() => {
    if (panzoomHandle.current) panzoomHandle.current.dispose();
    panzoomHandle.current = panzoom(wrapperRef.current!, {
      smoothScroll: false,
    });
    const { naturalWidth, naturalHeight } = imageRef.current!;
    setOrientation(naturalWidth > naturalHeight ? "landscape" : "portrait");
    setEditedId(0);
  }, [_id]);
  const editeds: string[] = details.editeds || [];
  const style: CSSProperties =
    orientation === "portrait"
      ? {
          height: "100%",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
        }
      : {
          width: "100%",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
        };
  return (
    <div
      id="image"
      data-edited-number={
        editeds.length ? `${editedId + 1} / ${editeds.length}` : undefined
      }
      ref={wrapperRef}
      onMouseDown={
        editeds.length
          ? (e) => {
              if (e.button === 1) {
                e.preventDefault();
                setEditedId((editedId + 1) % editeds.length);
              }
            }
          : undefined
      }
      onMouseMove={(e) => {
        if (editeds.length) {
          const { x: imgX, width } = imageRef.current!.getBoundingClientRect();
          const offsetX = e.clientX - imgX;
          const x = (offsetX / width) * 100;
          imageRef.current!.style.clipPath = `polygon(0 0, ${x}% 0, ${x}% 100%, 0 100%)`;
        } else imageRef.current!.style.clipPath = "";
      }}
    >
      {editeds.length ? (
        <img
          className="edited"
          style={style}
          src={fileUrl(dir + "/" + editeds[editedId])}
        />
      ) : null}
      <img ref={imageRef} src={fileUrl(path)} style={style} />
    </div>
  );
}
