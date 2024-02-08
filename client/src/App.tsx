import { FC, useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
import VideoViewer from "./VideoViewer";
import { iDir, iFile } from "./types";
import Explorer from "./Explorer";
import { dirToPrevDir, objectToQuery, prepareFile } from "./utils";
import { GlobalContext, setDir, SetFile } from "./GlobalContext";
import { getDir, postFile } from "./utils/api";
import "./App.scss";

const VIEWER = {
  image: ImageViewer,
  video: VideoViewer,
};

function App() {
  const [{ dir, file }, setState] = useState<{
    dir: iDir | null;
    file: iFile | null;
  }>({ dir: null, file: null });
  const [viewerMode, setViewerMode] = useState(false);
  const setDir: setDir = (dir, pushHistory = true) =>
      getDir(dir).then((data) => {
        // push history
        if (pushHistory)
          history.pushState({}, "", `/?${objectToQuery({ dir })}`);
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
          file: newFile ? newFile.name + newFile.ext : "",
        })}`
      );
      setState({ dir, file: newFile });
    };
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    const dirPath = search.get("dir") || "";
    setDir(dirPath, false).then((dir) => {
      const filename = search.get("file")!;
      if (filename) {
        const file = dir.files.find((f) => f.name + f.ext === filename);
        if (file) setState({ file, dir });
      }
    });
  }, []);
  //
  if (!dir) return "Loading...";
  const Viewer: FC | null = file ? VIEWER[file.type as "image"] : null;
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
              if (newDir.files[id]._id === newFile._id)
                newDir.files[id] = newFile;
            setState({ file: newFile, dir: newDir });
            setFile(newFile);
          }),
        viewerMode,
        setViewerMode,
      }}
    >
      {Viewer ? <Viewer /> : <div id="viewer"></div>}
      {!viewerMode && <Explorer />}
    </GlobalContext.Provider>
  );
}

export default App;
