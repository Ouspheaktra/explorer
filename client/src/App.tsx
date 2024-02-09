import { useEffect, useRef, useState } from "react";
import { iDir, iFile } from "./types";
import Explorer from "./Explorer";
import { dirToPrevDir, objectToQuery, prepareFile } from "./utils";
import { GlobalContext, Next, SetDir, SetFile } from "./GlobalContext";
import { getDir, postFile } from "./utils/api";
import ImagePlugin from "./ImagePlugin";
import VideoPlugin from "./VideoPlugin";
import PrevNext from "./PrevNext";
import "./App.scss";

const plugins = [ImagePlugin, VideoPlugin];

function App() {
  const [{ dir, file }, setState] = useState<{
    dir: iDir | null;
    file: iFile | null;
  }>({ dir: null, file: null });
  const [viewerMode, setViewerMode] = useState(false);
  const nextRef = useRef<Next>(() => {});
  const setDir: SetDir = (dir, pushHistory = true) =>
      getDir(dir).then((data) => {
        // push history
        if (pushHistory) {
          history.pushState({}, "", `/?${objectToQuery({ dir })}`);
          document.title = dir;
        }
        // prepare
        data.prevDir = dirToPrevDir(data.dir);
        data.files.forEach((f, i) => {
          f._id = i;
          prepareFile(f);
        });
        //
        setState({ file: null, dir: data });
        return data;
      }),
    setFile: SetFile = (newFile) => {
      history.pushState(
        {},
        "",
        `/?${objectToQuery({
          dir: dir?.dir,
          file: newFile ? newFile.fullname : "",
        })}`
      );
      document.title = newFile ? newFile.name : dir?.dir || "Explorer";
      setState({ dir, file: newFile });
    };
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    const dirPath = search.get("dir") || "";
    setDir(dirPath, false).then((dir) => {
      const filename = search.get("file")!;
      if (filename) {
        const file = dir.files.find((f) => f.fullname === filename);
        if (file) setState({ file, dir });
      }
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
        file: file as iFile,
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
            history.replaceState(
              {},
              "",
              `/?${objectToQuery({
                dir: newDir.dir,
                file: newFile.fullname,
              })}`
            );
            document.title = newFile.name;
            setState({ file: newFile, dir: newDir });
          }),
        viewerMode,
        setViewerMode,
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
