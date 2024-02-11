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
        "image-thumbnail" + (details.editeds?.length ? " edited" : "")
      }
      ref={elRef}
    >
      {loadImg && <img src={fileUrl(path)} />}
      <span>{fullname}</span>
    </div>
  );
}

function FileRender({ fullMode, file }: FileComponentProps) {
  const editeds = file.details.editeds || [];
  editedsRef.current.push(...editeds);
  if (fullMode) return <FileFullMode file={file} />;
  else
    return (
      <span className={editeds.length ? "edited" : ""}>{file.fullname}</span>
    );
}

function AvatarOnly() {
  const [avatarOnly, setAvatarOnly] = useState(false);
  return (
    <button
      onClick={() => {
        const styleId = "avatar-only-style";
        document.getElementById(styleId)?.remove();
        if (!avatarOnly) {
          const style = document.createElement("style");
          style.id = styleId;
          style.innerHTML = "ul.list-group-files > li > :not(.edited) { display: none !important; }";
          document.head.append(style);
        }
        setAvatarOnly(!avatarOnly);
      }}
    >
      {avatarOnly ? "show all" : "avatar only"}
    </button>
  );
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
      bottomButtons={<AvatarOnly />}
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
