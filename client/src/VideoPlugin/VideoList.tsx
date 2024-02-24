import { useRef } from "react";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import StringRenderer from "../Details/StringRenderer";
import { useGlobal } from "../GlobalContext";
import List from "../List";
import { createSort } from "../List/utils";
import FileRender from "./FileRenderer";
import { iVideoDetails } from "./types";
import { Plugin, iFile } from "../types";
import RotateRenderer from "./RotateRenderer";
import CropToPortraitRenderer from "./CropToPortrat";
import ReThumbnail from "./ReThumbnail";

const VideoList: Plugin["List"] = ({ closeButton }) => {
  const {
    dir: { files },
  } = useGlobal();
  const filesStore = useRef<iFile[]>([]);
  if (files !== filesStore.current)
    filesStore.current = files.filter((file) => file.type === "video");
  return (
    <List<iVideoDetails>
      id="video-list"
      filteredFiles={filesStore.current}
      FileComponent={FileRender}
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
      details={{
        formName: ({ avatars, title }) =>
          [...(avatars || []), title].filter(Boolean).join(" - "),
        detailsTypes: [
          {
            name: "avatars",
            Renderer: StringArrayRenderer,
            toFormName: true,
          },
          {
            name: "tags",
            Renderer: StringArrayRenderer,
          },
          {
            name: "title",
            Renderer: StringRenderer,
            toFormName: true,
          },
          {
            name: "rotate" as any,
            Renderer: RotateRenderer,
          },
          {
            name: "re-thumbnail" as any,
            Renderer: ReThumbnail,
          },
          {
            name: "crop to portrait" as any,
            Renderer: CropToPortraitRenderer,
          },
        ],
      }}
    />
  );
};

export default VideoList;
