import { useState } from "react";
import List from "./List";
import { useGlobal } from "./contexts/GlobalContext";

export default function Explorer() {
  // const {
  //   dir,
  //   goto,
  //   file,
  //   setFile,
  //   setViewerMode,
  // } = useGlobal();
  return (
    <List>
      {/* {file && (
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
      {file && <li onClick={() => setFile(null)}>===</li>} */}
    </List>
  );
}
