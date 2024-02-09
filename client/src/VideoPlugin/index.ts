import VideoViewer from "./VideoViewer";
import VideoList from "./VideoList";
import { Plugin } from "../types";
import "./style.scss";

const VideoPlugin: Plugin = {
  type: "video",
  Viewer: VideoViewer,
  List: VideoList,
}

export default VideoPlugin;