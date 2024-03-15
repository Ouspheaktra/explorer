import { CSSProperties, useEffect, useRef, useState } from "react";
import { useGlobal } from "../GlobalContext";
import { fileUrl } from "../utils";
import PanZoom from "../utils/panzoom";
import { updateFile } from "../VideoPlugin/utils";

export default function ImageViewer() {
  const {
    file,
    dir: { files },
    updateFiles,
    deleteFiles,
  } = useGlobal();
  const { _id, path, dir, details } = file;
  const [editedId, setEditedId] = useState(0);
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    "portrait"
  );
  const imageRef = useRef<HTMLImageElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const panzoomHandle = useRef<PanZoom>();
  useEffect(() => {
    panzoomHandle.current?.dispose();
    panzoomHandle.current = new PanZoom(wrapperRef.current!, {
      panButtons: [0, 2],
      onEnd: (translateX, translateY, scale) => {
        updateFile(updateFiles, file, {
          translateX: translateX === 0 ? undefined : translateX,
          translateY: translateY === 0 ? undefined : translateY,
          scale: scale === 1 ? undefined : scale,
        });
      },
    });
    const { naturalWidth, naturalHeight } = imageRef.current!;
    setOrientation(naturalWidth > naturalHeight ? "landscape" : "portrait");
    setEditedId(0);
    panzoomHandle.current.set(
      details.translateX || 0,
      details.translateY || 0,
      details.scale || 1
    );
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
      onContextMenu={(e) => e.preventDefault()}
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
      {editeds.length ? (
        <button
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
          }}
          onClick={async () => {
            const edit = files.find((f) => f.fullname === editeds[editedId])!;
            await deleteFiles([edit]);
            const newEditeds = [...editeds];
            newEditeds.splice(editedId, 1);
            await updateFiles([
              [file, { ...details, editeds: newEditeds }, null],
            ]);
          }}
        >
          Delete edit
        </button>
      ) : null}
      <img ref={imageRef} src={fileUrl(path)} style={style} />
    </div>
  );
}
