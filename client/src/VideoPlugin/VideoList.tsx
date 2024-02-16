import { useRef } from "react";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import { useGlobal } from "../GlobalContext";
import List from "../List";
import { createSort } from "../List/utils";
import FileRender from "./FileRenderer";
import { iVideoDetails } from "./types";
import { iFile } from "../types";

export default function VideoList() {
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
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.stat.size - b.stat.size
          ),
        },
      ]}
      details={{
        formName: ({ avatars, title }) =>
          avatars && avatars.length
            ? [title, ...avatars].filter(Boolean).join(" - ")
            : "",
        detailsTypes: [
          {
            name: "avatars",
            Renderer: StringArrayRenderer,
            toFormName: true,
          },
          // {
          //   name: "title",
          //   Renderer: StringArrayRenderer,
          // },
        ],
      }}
    />
  );
}
