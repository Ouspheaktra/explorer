import List from "./List";
import { useGlobal } from "./contexts/GlobalContext";

export default function Explorer() {
  const {
    dir: { prevDir },
    goto,
    file,
    setFile,
    setViewerMode,
  } = useGlobal();
  return (
    <List
      listTop={
        <>
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
          {prevDir && <li onClick={() => goto(prevDir)}>&lt;&minus; Back</li>}
          {file && <li onClick={() => setFile(null)}>===</li>}
        </>
      }
    ></List>
  );
}
