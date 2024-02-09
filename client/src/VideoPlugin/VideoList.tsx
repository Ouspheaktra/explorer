import { forwardRef } from "react";
import List from "../List";
import { ListMethod } from "../List/types";

const VideoList = forwardRef<ListMethod>(function VideoList({}, ref) {
  return (
    <List
      ref={ref}
      id="video-list"
      fileType="video"
    />
  );
});

export default VideoList;

/*
<Info<iVideoDetails>
          formName={({ title }) => title}
          detailsTypes={[
            {
              name: "title",
              type: "string",
            },
          ]}
        />
*/