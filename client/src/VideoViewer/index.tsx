import { fileUrl } from "../utils";
import { useGlobal } from "../GlobalContext";
import Viewer from "../Viewer";
import Info from "../Viewer/Info";
import VideoPlayer from "../VideoPlayer";
import VideoList from "./VideoList";
import "./style.scss";

interface iVideoDetails {
  title: string;
}

export default function VideoViewer() {
  const {
    file: { path, _id },
    viewerMode,
  } = useGlobal();
  return (
    <>
      <Viewer type="video">
        <VideoPlayer _id={_id} src={fileUrl(path)} autoPlay controls />
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
      {viewerMode && <VideoList />}
    </>
  );
}
