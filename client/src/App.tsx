import { useEffect, useRef, useState } from "react";
import { AppState, iDir } from "./types";
import Explorer from "./Explorer";
import { dirToPrevDir, prepareFile, pushHistory, setTitle } from "./utils";
import { GlobalContext, Next, SetDir, SetFile } from "./GlobalContext";
import { getDir, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import PrevNext from "./PrevNext";
import "./App.scss";

const plugins = [ImagePlugin, VideoPlugin];

function App() {
  const [state, setState] = useState<AppState>({
    dir: null,
    file: null,
    viewerMode: false,
  });
  const { dir, file, viewerMode } = state;
  const nextRef = useRef<Next>(() => {});
  const setDir: SetDir = (dir, pushIntoHistory = true) =>
      getDir(dir).then((data) => {
        // push history
        if (pushIntoHistory) pushHistory({ ...state, dir: data }, true);
        // prepare
        data.prevDir = dirToPrevDir(data.dir);
        data.files.forEach((f, i) => {
          f._id = i;
          prepareFile(f);
        });
        //
        setState({ file: null, dir: data, viewerMode });
        return data;
      }),
    setFile: SetFile = (newFile) => {
      pushHistory({ ...state, file: newFile });
      setState({ viewerMode, dir, file: newFile });
    };
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    const dirPath = search.get("dir") || "";
    setDir(dirPath, false).then((dir) => {
      const filename = search.get("file")!;
      if (filename) {
        const file = dir.files.find((f) => f.fullname === filename);
        const viewerMode = search.get("viewerMode") === "true";
        if (file) {
          setState({ file, dir, viewerMode });
          setTitle({ ...state, dir, file });
        }
      } else setTitle({ ...state, dir });
    });
  }, []);
  //
  if (!dir) return "Loading...";
  const plugin =
    file && file.type && plugins.find((plugin) => plugin.type === file.type);
  return (
    <GlobalContext.Provider
      value={{
        dir,
        setDir,
        file: file!,
        setFile,
        updateFile: (file, details, newName) =>
          postFile(file, details, newName).then((newFileData) => {
            const newFile = prepareFile({ ...file, ...newFileData });
            const newDir: iDir = { ...dir!, files: [...dir!.files] };
            for (let id = 0; id < newDir.files.length; id++)
              if (newDir.files[id]._id === newFile._id) {
                newDir.files[id] = newFile;
                break;
              }
            pushHistory({ ...state, dir: newDir, file: newFile }, false);
            setState({ file: newFile, dir: newDir, viewerMode });
          }),
        viewerMode,
        setViewerMode: (viewerMode) => {
          pushHistory({ ...state, viewerMode }, false);
          setState({ file, dir, viewerMode });
        },
        next: (plus) => nextRef.current(plus),
        setNext: (next) => (nextRef.current = next),
      }}
    >
      <div id="viewer">
        {plugin && <plugin.Viewer />}
        {file && <PrevNext />}
      </div>
      {viewerMode && plugin ? <plugin.List /> : <Explorer />}
    </GlobalContext.Provider>
  );
}

export default App;
