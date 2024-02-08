import { fileUrl } from "../utils";
import { useGlobal } from "../GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import VideoPlayer from "../VideoPlayer";
import VideoList from "./VideoList";
import { useRef } from "react";
import { ListMethod } from "../List/types";
import { iVideoDetails } from "./types";
import "./style.scss";

export default function VideoViewer() {
  const listRef = useRef<ListMethod>(null);
  const {
    file: { path, _id },
    viewerMode,
  } = useGlobal();
  const onNext = () => listRef.current?.next(1),
    onPrev = () => listRef.current?.next(-1);
  return (
    <>
      <Viewer type="video">
        <VideoPlayer
          _id={_id}
          src={fileUrl(path)}
          autoPlay
          controls
          onNext={onNext}
          onPrev={onPrev}
        />
        {listRef.current && (
          <>
            <button className="prev" onClick={onPrev}>
              &lt;
            </button>
            <button className="next" onClick={onNext}>
              &gt;
            </button>
          </>
        )}
        <Info<iVideoDetails>
          formName={({ title }) => title}
          detailsTypes={[
            {
              name: "title",
              type: "string",
            },
          ]}
        />
      </Viewer>
      {viewerMode && <VideoList ref={listRef} />}
    </>
  );
}
