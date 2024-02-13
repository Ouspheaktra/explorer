import StringArrayRenderer from "../Details/StringArrayRenderer";
import { useGlobal } from "../GlobalContext";
import List from "../List";
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
      details={{
        formName: () => "",
        detailsTypes: [
          {
            name: "title",
            Renderer: StringArrayRenderer,
          },
        ],
      }}
    />
  );
}
