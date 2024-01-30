import { useDir } from "./contexts/DirContext";
import "./VideoViewer.scss";

export default function VideoViewer() {
  const {
    data: { file },
  } = useDir();
  return (
    <div id="viewer" className="video">
      <video id="video" src={`/view?file=${file.rawPath}`} autoPlay controls />
    </div>
  );
}
