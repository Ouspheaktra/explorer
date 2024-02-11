import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { createSort } from "../List/utils";
import List from "../List";
import { fileUrl } from "../utils";
import { iImageDetails } from "./types";
import { iFile } from "../types";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import EditedsRenderer from "./EditedsRenderer";

const styleId = "image-list-style";
const editedsRef: { current: string[] } = { current: [] };

function FileFullMode({
  file: { fullname, path, details },
}: {
  file: iFile<iImageDetails>;
}) {
  const [loadImg, setToLoad] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scroll = () => {
      const elY = elRef.current!.offsetTop;
      if (
        window.scrollY - 50 < elY &&
        elY < window.scrollY + window.innerHeight
      ) {
        setToLoad(true);
        window.removeEventListener("scroll", scroll);
      }
    };
    window.addEventListener("scroll", scroll);
    scroll();
    return () => {
      window.removeEventListener("scroll", scroll);
    };
  }, []);
  return (
    <div
      className={
        "image-thumbnail" + (details.editeds?.length ? " editeds" : "")
      }
      ref={elRef}
    >
      {loadImg && <img src={fileUrl(path)} />}
      <span>{fullname}</span>
    </div>
  );
}

function FileRender({ fullMode, file }: FileComponentProps) {
  editedsRef.current.push(...(file.details.editeds || []));
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

export default function ImageList() {
  editedsRef.current = [];
  useEffect(() => {
    document.getElementById(styleId)?.remove();
    if (editedsRef.current.length) {
      const style = document.createElement("style");
      style.id = styleId;
      style.innerHTML =
        editedsRef.current
          .map(
            (fullname) =>
              `ul.list-group-files > li[data-file-fullname="${fullname}"]`
          )
          .join(",") + "{display:none}";
      document.head.append(style);
    }
  });
  return (
    <List<iImageDetails>
      fileType="image"
      id="image-list"
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
        formName: ({ avatars }) =>
          avatars && avatars.length ? avatars.join(" - ") : "",
        detailsTypes: [
          {
            name: "avatars",
            Renderer: StringArrayRenderer,
            toFormName: true,
          },
          {
            name: "editeds",
            Renderer: EditedsRenderer,
          },
        ],
      }}
    />
  );
}
