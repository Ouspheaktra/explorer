import { useState } from "react";
import List from "../List";
import { useGlobal } from "../contexts/GlobalContext";

export default function Album() {
  const {
    dir: { prevDir, files },
    goto,
    file,
    setFile,
    setViewerMode,
  } = useGlobal();
  const [order, setOrder] = useState("name");
  const orderedFiles = [...files].filter(o => o.type === "image");
  if (order === "name")
    orderedFiles.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <List>
      {prevDir && (
        <li
          style={{
            position: "sticky",
            top: 0,
            background: "black",
            paddingBlock: "10px",
          }}
          onClick={() => setViewerMode(false)}
        >
          ===
        </li>
      )}
      {orderedFiles.map((f, fid) => {
        const { type, ext, name, dir, _id } = f;
        const isCurrent = file && file._id === _id;
        return (
          <li
            key={fid}
            className={`is-${type} ${isCurrent ? "active" : ""}`}
            onClick={
              type !== "unknown" && !isCurrent
                ? () => {
                    // is file, change file
                    if (ext) setFile(f);
                    // if directory, change dir
                    else goto(dir);
                  }
                : undefined
            }
          >
            {name}
            {ext}
          </li>
        );
      })}
      <li
        style={{
          position: "sticky",
          bottom: 0,
          background: "black",
        }}
      >
        Order:
        <ul>
          {["name"].map((o) => (
            <button
              key={o}
              style={{ background: order === o ? "yellow" : "" }}
              onClick={() => setOrder(o)}
            >
              by {o}
            </button>
          ))}
        </ul>
      </li>
    </List>
  );
}
