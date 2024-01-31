import { useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import "./style.scss";

interface iImageDetails {
  avatars: string[];
}

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
      <Info<iImageDetails>
        formName={({ avatars }) => (avatars || []).join("-")}
        detailsTypes={[
          {
            name: "avatars",
            type: "string[]",
          },
        ]}
      />
    </Viewer>
  );
}
