import { useRef } from "react";
import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import "./style.scss";

interface iVideoDetails {
  title: string;
}

export default function VideoViewer() {
  let {
    file: { path },
  } = useGlobal();
  const video = useRef(null);
  return (
    <Viewer type="video">
      <video
        muted
        id="video"
        ref={video}
        src={fileUrl(path)}
        autoPlay
        controls
      />
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
  );
}
