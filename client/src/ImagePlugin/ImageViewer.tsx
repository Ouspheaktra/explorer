import { useEffect, useRef, useState } from "react";
import panzoom, { PanZoom } from "panzoom";
import { useGlobal } from "../GlobalContext";
import { fileUrl } from "../utils";

export default function ImageViewer() {
  const {
    file: { _id, path, dir, details },
  } = useGlobal();
  const [editedId, setEditedId] = useState(0);
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panzoomHandle = useRef<PanZoom>();
  useEffect(() => {
    if (panzoomHandle.current) panzoomHandle.current.dispose();
    panzoomHandle.current = panzoom(wrapperRef.current!, {
      smoothScroll: false,
    });
  }, [_id]);
  const editeds: string[] = details.editeds || [];
  return (
    <div
      id="image"
      ref={wrapperRef}
      onClick={
        editeds.length
          ? (e) => e.button === 1 && setEditedId(editedId + 1)
          : undefined
      }
      onMouseMove={
        editeds.length
          ? (e) => {
              const { x: imgX, width } =
                imageRef.current!.getBoundingClientRect();
              const offsetX = e.clientX - imgX;
              const x = (offsetX / width) * 100;
              imageRef.current!.style.clipPath = `polygon(0 0, ${x}% 0, ${x}% 100%, 0 100%)`;
            }
          : undefined
      }
    >
      {editeds.length ? (
        <img
          className="edited"
          src={fileUrl(dir + "/" + editeds[editedId % editeds.length])}
        />
      ) : null}
      <img ref={imageRef} src={fileUrl(path)} />
    </div>
  );
}
