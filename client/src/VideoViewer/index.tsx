import { fileUrl } from "../utils";
import { useGlobal } from "../contexts/GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import VideoPlayer from "../VideoPlayer";
import "./style.scss";

interface iVideoDetails {
  title: string;
}

export default function VideoViewer() {
  let {
    file: { path, _id },
  } = useGlobal();
  return (
    <Viewer type="video">
      <VideoPlayer
        _id={_id}
        id="video"
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
