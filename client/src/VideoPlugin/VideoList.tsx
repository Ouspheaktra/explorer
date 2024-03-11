import { useRef } from "react";
import { useGlobal } from "../GlobalContext";
import List from "../components/List";
import { createSort } from "../components/List/utils";
import VideoFileComponent from "./VideoFileComponent";
import { Plugin, iFile } from "../types";
import RotateRenderer from "../components/RotateEditor";
import CropRenderer from "../components/CropEditor";
import ReThumbnailEditor from "../components/ReThumbnailEditor";
import TrimEditor from "../components/TrimEditor";
import { iVideoDetails } from "./types";
import createStringArrayDetailsEditor from "../components/createStringArrayDetailsEditor";
import createStringDetailsEditor from "../components/createStringDetailsEditor";
import AutoShutdown from "../components/AutoShutdown";
import { RenameEditor } from "../components/RenameEditor";

const VideoList: Plugin["List"] = ({ closeButton }) => {
  const {
    dir: { files },
  } = useGlobal();
  const filesStore = useRef<iFile[]>([]);
  if (files !== filesStore.current)
    filesStore.current = files.filter((file) => file.type === "video");
  return (
    <List
      id="video-list"
      filteredFiles={filesStore.current}
      FileComponent={VideoFileComponent}
      topButtons={closeButton}
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.stat.size - b.stat.size
          ),
        },
        {
          name: "Title",
          sort: createSort(
            (file) => (file.details.title ? file.details.title[0] : false),
            (a, b) => a.details.title!.localeCompare(b.details.title!)
          ),
        },
        {
          name: "Tag",
          sort: createSort(
            (file) => (file.details.tags ? file.details.tags[0] : false),
            (a, b) => a.stat.size - b.stat.size
          ),
        },
      ]}
      EditorComponents={[
        RenameEditor,
        createStringArrayDetailsEditor("avatars", formName),
        createStringArrayDetailsEditor("tags"),
        createStringDetailsEditor("title", formName),
        RotateRenderer,
        ReThumbnailEditor,
        CropRenderer,
        TrimEditor,
        AutoShutdown,
      ]}
    />
  );
};

function formName({ avatars, title }: iVideoDetails) {
  return [...(avatars || []), title].filter(Boolean).join(" - ");
}

export default VideoList;
