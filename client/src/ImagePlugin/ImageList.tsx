import { useEffect, useRef, useState } from "react";
import { FileComponentProps } from "../List/types";
import { createSort } from "../List/utils";
import List from "../List";
import { fileUrl } from "../utils";
import { iImageDetails } from "./types";
import { iFile } from "../types";

function FileFullMode({ file: { fullname, path } }: { file: iFile }) {
  const [loadImg, setToLoad] = useState(false);
  const elRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const scroll = () => {
      const elY = elRef.current!.offsetTop;
      if (window.scrollY - 50 < elY && elY < window.scrollY + window.innerHeight) {
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
    <div className="image-thumbnail" ref={elRef}>
      {loadImg && <img src={fileUrl(path)} />}
      <span>{fullname}</span>
    </div>
  );
}

function FileRender({ fullMode, file }: FileComponentProps) {
  if (fullMode) return <FileFullMode file={file} />;
  else return file.fullname;
}

export default function ImageList() {
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
            type: "string[]",
          },
        ],
      }}
    />
  );
}
