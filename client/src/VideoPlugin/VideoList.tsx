import StringArrayRenderer from "../Details/StringArrayRenderer";
import { useGlobal } from "../GlobalContext";
import List from "../List";
import { iVideoDetails } from "./types";

export default function VideoList() {
  const {
    dir: { files },
  } = useGlobal();
  return (
    <List<iVideoDetails>
      id="video-list"
      filteredFiles={files.filter((file) => file.type === "video")}
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
