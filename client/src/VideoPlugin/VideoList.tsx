import StringArrayRenderer from "../Details/StringArrayRenderer";
import List from "../List";
import { iVideoDetails } from "./types";

export default function VideoList() {
  return (
    <List<iVideoDetails>
      id="video-list"
      fileType="video"
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
