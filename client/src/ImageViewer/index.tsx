import { useEffect, useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import Album from "./Album";
import "./style.scss";

interface iImageDetails {
  avatars: string[];
}

export default function ImageViewer() {
  let {
    dir: { files },
    file: { _id, path },
    viewerMode,
  } = useGlobal();
  const image = useRef(null);
  const panzoomHandle = useRef<PanZoom>();
  useEffect(() => {
    if (panzoomHandle.current) panzoomHandle.current.dispose();
    panzoomHandle.current = panzoom(image.current!, {
      smoothScroll: false,
    });
  }, [_id]);
  files = files.filter((o) => o.type === "image");
  return (
    <>
      <Viewer type="image">
        <img ref={image} id="image" src={fileUrl(path)} />
        <Info<iImageDetails>
          formName={({ avatars }) =>
            avatars && avatars.length ? avatars.join(" - ") : ""
          }
          detailsTypes={[
            {
              name: "avatars",
              type: "string[]",
            },
          ]}
        />
      </Viewer>
      {viewerMode && <Album />}
    </>
  );
}
