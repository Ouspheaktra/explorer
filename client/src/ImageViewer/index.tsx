import { useEffect, useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { fileUrl } from "../utils";
import { useGlobal } from "../GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import ImageList from "./ImageList";
import { iImageDetails } from "./types";
import "./style.scss";

export default function ImageViewer() {
  const {
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
      {viewerMode && <ImageList />}
    </>
  );
}
