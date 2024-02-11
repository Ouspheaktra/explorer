import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { createSort } from "../List/utils";
import List from "../List";
import { fileUrl } from "../utils";
import { iImageDetails } from "./types";
import { iFile } from "../types";
import StringArrayRenderer from "../Details/StringArrayRenderer";
import EditedsRenderer from "./EditedsRenderer";
import { useGlobal } from "../GlobalContext";

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
      className={"image-thumbnail" + (details.editeds?.length ? " edited" : "")}
      ref={elRef}
    >
      {loadImg && <img src={fileUrl(path)} />}
      <span>{fullname}</span>
    </div>
  );
}

function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
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
          style.innerHTML =
            "ul.list-group-files > li > :not(.edited) { display: none !important; }";
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
  const {
    dir: { files },
  } = useGlobal();
  const editeds = files
    .filter((file) => file.details.editeds?.length)
    .map((file) => file.details.editeds)
    .flat();
  return (
    <List<iImageDetails>
      id="image-list"
      filteredFiles={files.filter(
        (file) => file.type === "image" && !editeds.includes(file.fullname)
      )}
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
