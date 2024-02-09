import { Plugin } from "../types";
import ImageList from "./ImageList";
import ImageViewer from "./ImageViewer";
import "./style.scss";

const ImagePlugin: Plugin = {
  type: "image",
  Viewer: ImageViewer,
  List: ImageList,
};

export default ImagePlugin;
