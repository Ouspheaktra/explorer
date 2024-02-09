import List from "../List";
import { iVideoDetails } from "./types";

export default function VideoList() {
  return (
    <List<iVideoDetails>
      id="video-list"
      fileType="video"
      details={{
        formName: ({ title }) => title,
        detailsTypes: [
          {
            name: "title",
            type: "string",
          },
        ],
      }}
    />
  );
}
