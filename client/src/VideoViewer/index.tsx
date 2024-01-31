import { useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import Viewer from "../Viewer";
import "./style.scss";

export default function VideoViewer() {
  let {
    file: { path },
  } = useGlobal();
  const video = useRef(null);
  const panzoomHandle = useRef<PanZoom>();
  return (
    <Viewer
      type="video"
      onNewFile={() => {
        if (panzoomHandle.current) panzoomHandle.current.dispose();
        panzoomHandle.current = panzoom(video.current!, {
          smoothScroll: false,
        });
      }}
    >
      <video
        muted
        id="video"
        ref={video}
        src={fileUrl(path)}
        autoPlay
        controls
      />
    </Viewer>
  );
}
