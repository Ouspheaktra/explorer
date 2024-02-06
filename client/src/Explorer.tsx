import { useState } from "react";
import List from "./List";
import { useGlobal } from "./contexts/GlobalContext";

type OrderName = "name" | "date";
type OrderOrder = "asc" | "desc";
type Order = [OrderName, OrderOrder];

export default function Explorer() {
  const {
    dir: { prevDir, files },
    goto,
    file,
    setFile,
    setViewerMode,
  } = useGlobal();
  const [[orderName, orderOrder], setOrder] = useState<Order>(["name", "asc"]);
  const orderedFiles = [...files];
  if (orderName === "name") {
    if (orderOrder === "asc")
      orderedFiles.sort((a, b) => a.name.localeCompare(b.name));
    else orderedFiles.sort((a, b) => b.name.localeCompare(a.name));
  } else if (orderName === "date") {
    if (orderOrder === "asc")
      orderedFiles.sort(
        (a, b) => a.stat!.mtime.getTime() - b.stat!.mtime.getTime()
      );
    else
      orderedFiles.sort(
        (a, b) => b.stat!.mtime.getTime() - a.stat!.mtime.getTime()
      );
  }
  return (
    <List name="explorer" level={0} defaultOpen={true}>
      {file && (
        <button
          onClick={() => setViewerMode(true)}
          style={{
            position: "absolute",
            right: 20,
            zIndex: 1,
          }}
        >
          Viewer
        </button>
      )}
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
          {["name", "date"].map((o) => (
            <button
              key={o}
              style={{ background: orderName === o ? "yellow" : "" }}
              onClick={() =>
                setOrder([
                  o as OrderName,
                  orderOrder === "asc" ? "desc" : "asc",
                ])
              }
            >
              by {o}
            </button>
          ))}
        </ul>
      </li>
    </List>
  );
}
