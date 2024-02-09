import { useEffect, useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
import { useGlobal } from "../GlobalContext";
import { fileUrl } from "../utils";

export default function ImageViewer() {
  const {
    file: { _id, path },
  } = useGlobal();
  const imageRef = useRef(null);
  const panzoomHandle = useRef<PanZoom>();
  useEffect(() => {
    if (panzoomHandle.current) panzoomHandle.current.dispose();
    panzoomHandle.current = panzoom(imageRef.current!, {
      smoothScroll: false,
    });
  }, [_id]);
  return <img id="image" ref={imageRef} src={fileUrl(path)} />;
}

/*
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
*/
