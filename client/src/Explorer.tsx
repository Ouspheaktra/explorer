import { useState } from "react";
import List from "./List";
import { useGlobal } from "./contexts/GlobalContext";

export default function Explorer() {
  const {
    dir: { prevDir, files },
    goto,
    file,
    setFile,
  } = useGlobal();
  const [order, setOrder] = useState("name");
  const orderedFiles = [...files];
  if (order === "name")
    orderedFiles.sort((a, b) => a.name.localeCompare(b.name));
  return (
    <List name="explorer" level={0} defaultOpen={true}>
      {prevDir && (
        <li
          style={{
            position: "sticky",
            top: 0,
            background: "black",
            paddingBlock: "10px",
          }}
          onClick={() => goto(prevDir)}
        >
          &lt;&minus; Back
        </li>
      )}
      {file && <li onClick={() => setFile(null)}>===</li>}
      {orderedFiles.map((f, fid) => {
        const { type, ext, name, id, dir, _id } = f;
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
            {id ? " - " + id : ""}
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
