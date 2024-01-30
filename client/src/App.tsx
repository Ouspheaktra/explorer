import { FC, useEffect, useState } from "react";
import ImageViewer from "./ImageViewer";
// import VideoViewer from "./VideoViewer";
import { iDir, iFile } from "./types";
import Explorer from "./Explorer";
import {
  dirToPrevDir,
  gotoDir,
  objectToQuery,
  postFile,
  prepareFile,
} from "./utils";
import "./App.scss";
import { GlobalContext, Goto } from "./contexts/GlobalContext";

const VIEWER = {
  image: ImageViewer,
  // video: VideoViewer,
};

function App() {
  const [{ dir, file }, setState] = useState<{
    dir: iDir | null;
    file: iFile | null;
  }>({ dir: null, file: null });
  const goto: Goto = (dir) =>
    gotoDir(dir).then((data) => {
      history.pushState({}, "", `/?${objectToQuery({ dir })}`);
      data.prevDir = dirToPrevDir(data.dir);
      data.files.forEach((f, i) => {
        f._id = i;
        prepareFile(f);
      });
      setState({ file, dir: data });
    });
  // query data
  useEffect(() => {
    const search = new URLSearchParams(location.search.slice(1));
    goto(search.get("dir") || "");
  }, []);
  //
  if (!dir) return "Loading...";
  const Viewer: FC | null = file ? VIEWER[file.type as "image"] : null;
  return (
    <GlobalContext.Provider
      value={{
        dir,
        goto,
        file: file as iFile,
        setFile: (newFile) => setState({ dir, file: newFile }),
        updateFile: (file, details, newName) =>
          postFile(file, details, newName).then((newFileData) => {
            const newFile = prepareFile({ ...file, ...newFileData });
            const newDir: iDir = { ...dir!, files: [...dir!.files] };
            for (let id = 0; id < newDir.files.length; id++)
              if (newDir.files[id]._id === newFile._id)
                newDir.files[id] = newFile;
            setState({ file: newFile, dir: newDir });
          }),
      }}
    >
      {Viewer ? <Viewer /> : <div id="viewer"></div>}
      <Explorer />
    </GlobalContext.Provider>
  );
}

export default App;
