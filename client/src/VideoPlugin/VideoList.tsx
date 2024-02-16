import StringArrayRenderer from "../Details/StringArrayRenderer";
import { useGlobal } from "../GlobalContext";
import List from "../List";
import { createSort } from "../List/utils";
import FileRender from "./FileRenderer";
import { iVideoDetails } from "./types";

export default function VideoList() {
  const {
    dir: { files },
  } = useGlobal();
  return (
    <List<iVideoDetails>
      id="video-list"
      filteredFiles={files.filter((file) => file.type === "video")}
      FileComponent={FileRender}
      sorts={[
        {
          name: "Avatar",
          sort: createSort(
            (file) => (file.details.avatars ? file.details.avatars[0] : false),
            (a, b) => a.details.avatars[0].localeCompare(b.details.avatars[0])
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
