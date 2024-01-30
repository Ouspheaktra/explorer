import { useEffect, useRef } from "react";
import panzoom, { PanZoom } from "panzoom";
// import ImageBrowser from "./Browser";
import ImageInfo from "./Info";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import "./style.scss";

export default function ImageViewer() {
  let {
    dir: { files },
    file,
    setFile,
  } = useGlobal();
  const image = useRef(null);
  const panzoomHandle = useRef<PanZoom>();
  const { _id, path, name } = file;
  // after updateImage() is called, new `path` can be comming
  // we don't want to rerender <img> every time we update something
  // so we store `path`, we update only when new `_id` is coming
  // const [path, setPath] = useState(newPath);
  useEffect(() => {
    // setPath(newPath);
    if (panzoomHandle.current) panzoomHandle.current.dispose();
    panzoomHandle.current = panzoom(image.current!, {
      smoothScroll: false,
    });
  }, [_id]);
  files = files.filter((o) => o.type === "image");
  const currentId = files.findIndex((f) => f.name === name),
    prevFile = files[currentId - 1],
    nextFile = files[currentId + 1];
  return (
    <>
      <div id="viewer" className="image">
        <img ref={image} id="image" src={fileUrl(path)} />
        <ImageInfo />
        {prevFile && (
          <button className="prev" onClick={() => setFile(prevFile)}>
            &lt;
          </button>
        )}
        {nextFile && (
          <button className="next" onClick={() => setFile(nextFile)}>
            &gt;
          </button>
        )}
      </div>
      {/* <ImageBrowser currentId={currentId} /> */}
    </>
  );
}
