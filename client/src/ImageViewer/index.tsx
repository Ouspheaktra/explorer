import { useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import "./style.scss";
import Viewer from "../Viewer";

export default function ImageViewer() {
  let {
    dir: { files },
    file: { path },
  } = useGlobal();
  const image = useRef(null);
  const panzoomHandle = useRef<PanZoom>();
  files = files.filter((o) => o.type === "image");
  return (
    <Viewer
      type="image"
      onNewFile={() => {
        if (panzoomHandle.current) panzoomHandle.current.dispose();
        panzoomHandle.current = panzoom(image.current!, {
          smoothScroll: false,
        });
      }}
    >
      <img ref={image} id="image" src={fileUrl(path)} />
    </Viewer>
  );
}
