import List from "../List";

export default function VideoList() {
  return <List id="video-list" fileType="video" />;
}

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
